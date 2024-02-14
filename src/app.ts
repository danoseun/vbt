import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import { handleErrors as errorMiddleware } from './middleware/error';
import { logger } from './utilities';
import { router } from './routes';
import { connect } from './config'

const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connect();

app.get('/v1/health', (req, res) =>
  res.status(200).json({
    status: 'success',
    message: 'server is up and running',
    data: null
  })
);


app.use('/v1', router);

app.use(errorMiddleware);

app.use((req, res, _next) =>
  res.status(404).json({
    status: 'error',
    message: 'resource not found',
    path: req.url
  })
);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`[UNEXPECTED ERROR] => ${err.message}`);

  return res.status(err.status || 500).send({
    status: 'error',
    message: 'Internal server error'
  });
});

export default app;