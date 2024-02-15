import { Request, Response, NextFunction } from "express";
import Stripe from 'stripe';
import HttpStatus from "http-status-codes";
import { User, UserModel } from "../models/user";
import { Transaction, TransactionModel } from "../models/transaction";
import { LoginResponse, TransactionStatus } from "../interfaces";
import BaseService from "../service";
import { respond, hashPassword, comparePassword, JWT, generateReferenceForTransaction } from "../utilities";
import {
  ConflictError,
  BadRequestError,
  NotAuthenticatedError,
  NotAuthorizedError,
} from "../errors";
import variables from "../variables";
import mongoose from "mongoose";

const stripe = new Stripe(variables.stripe.testKey);

export const userService = new BaseService(UserModel);
export const transactionService = new BaseService(TransactionModel);

export const userController = {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    let user: User;
    const { email, password, name } = req.body;
    try {
      const existingUser = await userService.show("email", email);

      if (existingUser) {
        throw new ConflictError("Email already in use");
      } else {
        const hashedPassword = await hashPassword(password);
        user = await userService.create({
          email,
          password: hashedPassword,
          name,
        });
      }

      delete user.password;
      return respond<User>(res, user, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const existingUser = await userService.show("email", email);

      if (!existingUser) {
        throw new BadRequestError("Email or password invalid");
      }
      const isMatch = await comparePassword(password, existingUser.password);
      if (!isMatch) {
        throw new NotAuthenticatedError("Invalid credentials");
      }
      const token = JWT.encode({
        email: existingUser.email,
        id: existingUser._id,
      });
      return respond<LoginResponse>(
        res,
        { existingUser, token },
        HttpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  },

  async updateUserRecord(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.email !== res.locals.user.email) {
        throw new NotAuthorizedError("Can't edit another user's record");
      }
      const updatedUserRecord = await userService.update(
        { _id: res.locals.user._id },
        req.body.name
      );
      delete updatedUserRecord.password;
      console.log("UPDATE", updatedUserRecord);
      return respond<User>(res, updatedUserRecord, HttpStatus.OK);
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  },

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    let newTransaction;
    try {
      await session.withTransaction(async () => {
        const { amount, email, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Number(amount),
          currency: currency,
          metadata: { integration_check: "accept_a_payment" },
          receipt_email: email || res.locals.user.email,
        });
        
        //add other fields as needed
        newTransaction = transactionService.create(
          {
            amount: paymentIntent.amount,
            status: TransactionStatus.PENDING,
            reference: generateReferenceForTransaction(),
            external_reference: paymentIntent.id,
            user: res.locals.user._id,
          },
          { session: session }
        );
        await session.commitTransaction();
      });
      return respond<Transaction>(res, newTransaction, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    } finally {
      session.endSession();
    }
  },

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ received: true })
    const session = await mongoose.startSession();
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      await session.withTransaction(async () => {
        // Handle the event
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          sig,
          variables.stripe.endPointSecret
        );
        switch (event.type) {
          case "payment_intent.succeeded": {
            // ideally, you may also want to do a couple of checks here
            const transaction = await transactionService.show("external_reference", event["data"]["object"]["id"])
            transactionService.update({ _id: transaction._id }, { status: TransactionStatus.PAID }, { session: session });
            break;
          }
          default:
            // Ideally you want to handle other event types
        }
      });
    } catch (error) {
      next(error);
    } finally {
      session.endSession();
    }
  }
};