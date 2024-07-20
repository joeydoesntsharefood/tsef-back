import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Request, Response } from 'express';
import { User } from "@prisma/client";
import userSchema from "@zod/user.zod";

import bcrypt from 'bcrypt';
import variables from "@setup/variables";
import generateToken from "@utils/generateJTW";
import moment from "moment";
import { AuthRequest, LoginResponse } from "src/types/auth.type";

import jwt from 'jsonwebtoken';

const register = catchAsync(async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    const { success, data, error } = userSchema.create.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const salt = await bcrypt.genSalt(Number(variables.saltRounds));

    const user = await prismaClient.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: await bcrypt.hash(data.password, salt),
      },
    });

    res.status(200).send(handleResponse<User>(true, user));
  } catch (error) {
    logger.error(
      '[user/controller/auth] - register',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const login = catchAsync(async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    const { success, data, error } = userSchema.edit.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user)
      return res
      .status(400)
      .json(handleResponse(false, 'Senha ou e-mail incorretos.'));

    const compare = await bcrypt.compare(data.password, user.password);

    if (!compare)
      return res
      .status(400)
      .json(handleResponse(false, 'Senha ou e-mail incorretos.'));

    const baseToken = {
      email: user.email,
    };

    const accessToken = generateToken({
      ...baseToken,
      type: 'acess',
    }, '2h');

    const refreshToken = generateToken({
      ...baseToken,
      type: 'refresh',
    }, '2 days');

    const date = moment();

    const tokens = {
      accessToken: {
        token: accessToken,
        expiresIn: date.add('2h'), 
      },
      refreshToken : {
        token: refreshToken,
        expiresIn: date.add('2 days'),
      }
    };

    const userData = {};

    Object.entries(user)
      .filter(value => value[0] !== 'password')
      .forEach(value => Object.assign(userData, { [value[0]]: value[1] }));

    res.status(200).send(handleResponse<LoginResponse>(true, { user: userData as LoginResponse['user'], tokens }));
  } catch (error) {
    logger.error(
      '[user/controller/auth] - login',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

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

      res.status(200).send(handleResponse<LoginResponse['tokens']>(true, tokens));
  } catch (error) {
    logger.error(
      '[user/controller/auth] - refreshToken',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

export default {
  register,
  login,
  refreshToken,
};
