import { User } from '../models/user';

export interface IJwtPayload {
  userId: number;
}

export interface LoginResponse {
  existingUser: User;
  token: string;
}
