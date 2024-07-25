import providerSchema from "@zod/provider.zod";

import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Request, Response } from 'express';
import { Prisma, Provider } from "@prisma/client";
import { AuthRequest } from "src/types/auth.type";
import { DefaultArgs } from "@prisma/client/runtime/library";
import verifyCountryCode from "@external/restCountries";

const create = catchAsync<AuthRequest>(async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    const { success, data, error } = providerSchema.create.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const { success: verifyCode } = await verifyCountryCode(data?.country_code);

    if (!verifyCode)
      return res
      .status(400)
      .json(handleResponse(false, [{ message: 'Código invalido', path: ['country_code'] }]));

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

const index = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const { id } = req.params;
    const query = req?.query;
    const fieldsQuery = query?.fields || undefined;
    const fields = {};

    if (fieldsQuery) {
      String(fieldsQuery).split(',')
      .forEach(value => {
        Object.assign(fields, { [value]: true })
      })
    };

    const provider = await prismaClient.provider.findUnique({
      where: {
        id,
      },
      ...(fieldsQuery ? { select: fields as Prisma.ProviderSelect<DefaultArgs> } : {})
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

const find = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const name = req.query?.name;
    const country_code = req?.query?.country_code;
    const query = req?.query;
    const fieldsQuery = query?.fields || undefined;
    const fields = {};

    if (fieldsQuery) {
      String(fieldsQuery).split(',')
      .forEach(value => {
        Object.assign(fields, { [value]: true })
      })
    };

    const queryDB = {
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
      },
      ...(fieldsQuery ? { select: fields as Prisma.ProviderSelect<DefaultArgs> } : {}),
    };

    const providers = await prismaClient.provider.findMany(queryDB);

    res.status(200).send(handleResponse<Provider[]>(true, providers));
  } catch (error) {
    logger.error(
      '[provider/controller/crud] - find',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const edit = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prismaClient.provider.findUnique({ 
      where: {
        id,
      }
    });

    const { body } = req;
    
    const { success, data, error } = providerSchema.edit.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const { success: verifyCode } = await verifyCountryCode(data?.country_code);

    if (!verifyCode)
      return res
      .status(400)
      .json(handleResponse(false, [{ message: 'Código invalido', path: ['country_code'] }]));

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

const deleteRow = catchAsync<AuthRequest>(async (req, res) => {
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
