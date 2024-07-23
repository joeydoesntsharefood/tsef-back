import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Request, Response } from 'express';
import userSchema from "@zod/user.zod";

import bcrypt from 'bcrypt';
import variables from "@setup/variables";
import generateToken from "@utils/generateJTW";
import moment from "moment";
import { LoginResponse } from "src/types/auth.type";

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

    const userData = {};

    Object.entries(user)
      .filter(value => value[0] !== 'password')
      .forEach(value => Object.assign(userData, { [value[0]]: value[1] }));

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
    
    res.status(200).send(handleResponse<LoginResponse>(true, { user: userData as LoginResponse['user'], tokens }));
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

    if (!body?.email && !body?.passsword)
      return res
      .status(400)
      .json(handleResponse(false, 'Envie todos dados de acesso.'));

    const user = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user)
      return res
      .status(400)
      .json(handleResponse(false, 'Senha ou e-mail incorretos.'));

    const compare = await bcrypt.compare(body.password, user.password);

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

export default {
  register,
  login,
};
