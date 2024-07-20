import express from 'express';
import variables from '@setup/variables';
import logger from '@utils/logger';
import router from './router';

const app = express();

const { baseUrl, port } = variables;

app.use(express.json());

app.use('/v1', router);

app.listen(port, () => {
  logger.info(`Server is running at ${baseUrl}:${port}`);
});