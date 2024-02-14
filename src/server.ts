import app from './app';
import variables from './variables';
import { createServerInstance } from './utilities';

const server = createServerInstance(variables.app.port, 'metric-service', app);

export default server;