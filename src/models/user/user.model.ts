import { model } from 'mongoose';

import { User } from './user.type';
import { UserSchema } from './user.schema';

export const MetricModel = model<User>('user', UserSchema);