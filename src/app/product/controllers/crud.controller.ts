import productSchema from "@zod/product.zod";

import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Request, Response } from 'express';
import { Product } from "@prisma/client";

const create = catchAsync(async (req: Request, res: Response) => {
  try {
    const { body } = req;
    
    const { success, data, error } = productSchema.safeParse(body);

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

    const product = await prismaClient.product.findUnique({
      where: {
        id,
      }
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

const find = catchAsync(async (_, res) => {
  try {
    const products = await prismaClient.product.findMany();

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
    
    const { success, data, error } = productSchema.safeParse(body);

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

const deleteRow = catchAsync(async (req, res) => {
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
