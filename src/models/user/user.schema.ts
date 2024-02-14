import { Schema } from 'mongoose';


const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);


export { UserSchema };