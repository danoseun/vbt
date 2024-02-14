import { Document } from "mongoose";
import { User } from "../user";

export interface Transaction extends Document {
  amount: number;
  status: string;
  user: User;
}
