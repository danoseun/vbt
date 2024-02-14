import { Schema } from 'mongoose';


const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
      }
  },
  {
    timestamps: true,
  }
);


export { UserSchema };