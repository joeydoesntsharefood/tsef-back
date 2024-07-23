import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import variables from "@setup/variables";
import generateToken from "@utils/generateJTW";
import moment from "moment";
import { AuthRequest, LoginResponse } from "src/types/auth.type";

import jwt from 'jsonwebtoken';

const refreshToken = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const { body } = req;

    if (!body?.refreshToken)
      return res
        .status(500)
        .send(handleResponse(false, 'Por favor envie o refreshToken.'));

    const verify = jwt.verify(body.refreshToken, variables.secretKey);
    
    if (typeof verify === 'string')
      res.status(401).json(handleResponse(false, 'Invalid or expired token'));
    
    const decoded = jwt.decode(body.refreshToken);
    
    const user = await prismaClient
      .user
      .findUnique(
        { 
          where: { email: (decoded as unknown as { email: string }).email },
          select: { email: true, createdAt: true, id: true, name: true, updatedAt: true }
        },
      );

      const baseToken = {
        email: user.email,
      };

      const date = moment();
  
      const tokens = {
        accessToken: {
          token: generateToken({
            ...baseToken,
            type: 'acess',
          }, '2h'),
          expiresIn: date.add('2h'), 
        },
        refreshToken : {
          token: generateToken({
            ...baseToken,
            type: 'refresh',
          }, '2 days'),
          expiresIn: date.add('2 days'),
        }
      };

      res.status(200).send(handleResponse<LoginResponse>(true, { user, tokens }));
  } catch (error) {
    logger.error(
      '[user/controller/auth] - refreshToken',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

export default  {
  refreshToken,
}