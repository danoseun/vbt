import mongoose from "mongoose";
import variables from "../variables";
import { logger } from "../utilities";

export const connect = async (): Promise<void> => {
  try {
    if (!variables.app.dbUrl) {
      throw new Error("DATABASE_URL not provided");
    }

    await mongoose.connect(variables.app.dbUrl);
    logger.info(`DB is successfully connected`);
  } catch (error) {
    logger.error(`DB connection error ${error}`);
  }
};

export const disconnect = () => {
  if (!variables.app.dbUrl) {
    return;
  }
  mongoose.disconnect();
};
