import { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export { TransactionSchema };
