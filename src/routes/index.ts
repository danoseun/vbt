import { Router } from 'express';


import { createUserSchema, loginUserSchema, updateUserSchema, createTransactionSchema } from '../validations';
import { userController } from '../controllers';
import { authenticate } from '../middleware/authenticate';


export const router = Router();


router.post('/signup', createUserSchema, userController.registerUser);
router.post('/login', loginUserSchema, userController.loginUser);
router.patch('/users/:email', authenticate, updateUserSchema, userController.updateUserRecord);
router.post('/transactions', authenticate, createTransactionSchema, userController.createTransaction);
router.post('/webhooks', userController.handleWebhook)
