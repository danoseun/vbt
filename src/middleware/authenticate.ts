import { Request, Response, NextFunction } from 'express';
import { NotBeforeError, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { userService } from '../controllers/user';
import { NotAuthenticatedError } from '../errors';
import { JWT } from '../utilities';


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new NotAuthenticatedError('No token provided'));
  }

  const [, token] = authorization.split(' ');

  try {
    if (!token) {
      return next(new NotAuthenticatedError('No token provided'));
    }

    const decoded = JWT.decode(token);

    let user = await userService.show("email", decoded.email);

    if (!user) {
      return next(new NotAuthenticatedError('Invalid token'));
    }
    user = user.toObject();
    delete user.password;
    res.locals.user = user;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new NotAuthenticatedError('Token has expired'));
    }

    if (error instanceof NotBeforeError) {
      return next(new NotAuthenticatedError('Token used prematurely'));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new NotAuthenticatedError('Invalid token'));
    }
    return next(error);
  }
};