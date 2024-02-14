import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    value: number;
}