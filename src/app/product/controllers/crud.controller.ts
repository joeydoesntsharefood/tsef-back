import productSchema from "@zod/product.zod";

import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Prisma, Product } from "@prisma/client";
import { AuthRequest } from "src/types/auth.type";
import { DefaultArgs } from "@prisma/client/runtime/library";

const create = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const { body } = req;
    
    const { success, data, error } = productSchema.create.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    const product = await prismaClient.product.create({
      data: {
        name: data.name,
        category: data?.category,
        price: data?.price,
        description: data?.description,
        quantity: data?.quantity,
        providerId: data?.providerId,
      },
    });

    res.status(200).send(handleResponse<Product>(true, product));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - create',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const index = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const query = req.query;
    const fieldsQuery = query?.fields || undefined;
    const fields = {};

    if (fieldsQuery) {
      String(fieldsQuery).split(',')
      .forEach(value => {
        Object.assign(fields, { [value]: true })
      })
    };

    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
      ...(fieldsQuery ? { select: fields as Prisma.ProductSelect<DefaultArgs> } : {})
    });

    res.status(200).send(handleResponse<Product>(true, product));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - index',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const find = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const query = req.query;

    const products = await prismaClient.product.findMany({
      include: {
        Provider: true,
      }
    });

    res.status(200).send(handleResponse<Product[]>(true, products));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - find',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const edit = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prismaClient.product.findUnique({ 
      where: {
        id,
      }
    });

    const { body } = req;
    
    const { success, data, error } = productSchema.edit.safeParse(body);

    if (!success) 
      return res
      .status(400)
      .json(handleResponse(false, JSON.parse(error?.message)));

    Object.assign(product, data);

    await prismaClient.product.update({ where: { id }, data: product });

    res.status(200).send(handleResponse<Product>(true, product));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - edit',
      error,
    );
    
    res.status(400).send(handleResponse<Error>(false, error?.message ?? 'Ocorreu um erro.'));
  }
});

const deleteRow = catchAsync<AuthRequest>(async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.product.delete({
      where: {
        id,
      }
    });

    res.status(200).send(handleResponse(true));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - delete',
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
