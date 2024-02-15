import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { User, UserModel } from "../models/user";
import { LoginResponse } from "../interfaces";
import BaseService from "../service";
import { respond, hashPassword, comparePassword, JWT } from "../utilities";
import {
  ConflictError,
  BadRequestError,
  NotAuthenticatedError,
} from "../errors";

export const userService = new BaseService(UserModel);

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
    let token: string;

    const { email, password } = req.body;
    try {
      const existingUser = await userService.show('email', email);
      
      if (!existingUser) {
        throw new BadRequestError('Email or password invalid');
      }
      const isMatch = await comparePassword(password, existingUser.password)
      if (!isMatch) {
        throw new NotAuthenticatedError('Invalid credentials');
      }
      const token = JWT.encode({ email: existingUser.email, id: existingUser._id });
      return respond<LoginResponse>(res,{ existingUser, token }, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },
};
