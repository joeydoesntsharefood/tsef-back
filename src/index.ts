import express from 'express';
import variables from '@setup/variables';
import logger from '@utils/logger';
import router from './router';
import log from '@middlewares/log';

const app = express();

const { baseUrl, port } = variables;

app.use(express.json());

app.use(log);

app.use('/v1', router);

app.listen(port, () => {
  logger.info(`Server is running at ${baseUrl}:${port}`);
});