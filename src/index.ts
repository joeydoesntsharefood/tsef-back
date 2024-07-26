import express from 'express';
import variables from '@setup/variables';
import logger from '@utils/logger';
import router from './router';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import openAPIConfig from './swagger';

const { baseUrl, port } = variables;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description: 'This is a REST API application made with Express and documented with Swagger.',
  },
  servers: [
    {
      url: `${baseUrl}:${port}`,
    },
  ],
  ...openAPIConfig,
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./swagger.ts'],
});

const app = express();

app.use(express.json());

app.use(cors());

app.use('/v1', router);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
  logger.info(`Server is running at ${baseUrl}:${port}`);
});