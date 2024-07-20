import providerSchema from "@zod/provider.zod";

import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Request, Response } from 'express';
import { Provider } from "@prisma/client";

const create = catchAsync(async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    const { success, data, error } = providerSchema.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const provider = await prismaClient.provider.create({
      data: {
        country_code: data.country_code,
        name: data.name
      },
    });

    res.status(200).send(handleResponse<Provider>(true, provider));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - create',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const index = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prismaClient.provider.findUnique({
      where: {
        id,
      }
    });

    res.status(200).send(handleResponse<Provider>(true, provider));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - index',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const find = catchAsync(async (req, res) => {
  try {
    const name = req.query?.name;
    const country_code = req?.query?.country_code;

    const query = {
      where: {
        ...(
          name
          ? {
            name: {
              contains: String(name ?? '')
            },
          }
          : {}
        ),
        ...(
          country_code
          ? {
            country_code: {
              equals: String(country_code ?? ''),
            }
          }
          : {}
        )
      }
    };

    const providers = await prismaClient.provider.findMany(query);



    res.status(200).send(handleResponse<Provider[]>(true, providers));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - find',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const edit = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prismaClient.provider.findUnique({ 
      where: {
        id,
      }
    });

    const { body } = req;
    
    const { success, data, error } = providerSchema.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    Object.assign(provider, data);

    await prismaClient.provider.update({ where: { id }, data: provider });

    res.status(200).send(handleResponse<Provider>(true, provider));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - edit',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const deleteRow = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.provider.delete({
      where: {
        id,
      }
    });

    res.status(200).send(handleResponse(true));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - delete',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});


export default {
  create,
  index,
  find,
  edit,
  deleteRow,
};
