import { Router } from 'express';


import { createUserSchema, loginUserSchema } from '../validations';
import { userController } from '../controllers';


export const router = Router();


router.post('/signup', createUserSchema, userController.registerUser);
router.post('/login', loginUserSchema, userController.loginUser);
