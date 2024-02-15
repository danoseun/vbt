import bcrypt from 'bcrypt';
import { logger } from './logger.utility';
import variables from '../variables';

const saltRounds = Number(variables.auth.saltRound);

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log('ERR', error);
    throw error;
  }
};

export { hashPassword, comparePassword };
