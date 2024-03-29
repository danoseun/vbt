import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV;

const variables = {
  app: {
    port: Number(process.env.PORT),
    environment,
    isDev: environment === 'development',
    isTesting: environment === 'test',
    isProd: environment === 'production',
    isStaging: environment === 'staging',
    dbUrl: process.env.DATABASE_URL
  },
  logs: {
    logLevel: process.env.LOG_LEVEL || 'info',
    showAppLogs: process.env.SHOW_APPLICATION_LOGS === 'true',
    databaseLogs: process.env.SHOW_DATABASE_LOGS === 'true'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    saltRound: process.env.SALT_ROUNDS
  },
  stripe: {
    testKey: process.env.STRIPE_SECRET_KEY,
    endPointSecret: process.env.ENDPOINT_SECRET
  }
};

export default variables;