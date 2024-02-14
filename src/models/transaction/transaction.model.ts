import { model } from "mongoose";

import { Transaction } from "./transaction.type";
import { TransactionSchema } from "./transaction.schema";

export const TransactionModel = model<Transaction>(
  "transaction",
  TransactionSchema
);
