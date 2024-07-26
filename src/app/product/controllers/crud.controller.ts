import productSchema from "@zod/product.zod";

import prismaClient from "@db/prisma";

import handleResponse from "@utils/handleReturn";
import catchAsync from "@utils/catchAsync";
import logger from "@utils/logger";

import { Prisma, Product } from "@prisma/client";
import { AuthRequest } from "src/types/auth.type";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Pagination } from "src/types/globals";

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

    const page = query?.page ? Number(query?.page) : 1;
    const pageSize = query?.pageSize ? Number(query?.pageSize) : 10;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy = undefined;

    if (query?.sort) {
      orderBy = {
        [String(query?.sort).split('/')[0]]: String(query?.sort).split('/')[1].toLocaleLowerCase(),
      }
    }

    const where = {
      ...(
        query?.priceStart || query?.priceEnd
        ? {
          price: {
            ...(query?.priceStart ? { gte: parseInt(query?.priceStart as string) } : {}),
            ...(query?.priceEnd ? { lte: parseInt(query?.priceEnd as string) } : {}),
          }
        }
        : {}
      ),
      ...( 
        query?.quantityStart || query?.quantityEnd
        ? {
          quantity: {
            ...(query?.quantityStart ? { gte: parseInt(query?.quantityStart as string) } : {}),
            ...(query?.quantityEnd ? { lte: parseInt(query?.quantityEnd as string) } : {}),
          }
        }
        : {}
      ),
      ...(
        query?.country_code
        ? {
            Provider: {
              country_code: String(query.country_code),   
            }
          } 
        : {}
      ),
      ...(
        query?.name
        ? {
            name: {
              startsWith: String(query.name)
            }
          }
        : {}
      ),
    };
    
    const data = await prismaClient.product.findMany({
      where,
      include: {
        Provider: true,
      },
      ...(orderBy ? { orderBy } : {}),
      take,
      skip,
    });
    
    const totalDocs = await prismaClient.product.count({ where });
    
    const totalPages = Math.ceil(totalDocs / pageSize);
    
    const pagination: Pagination<Product[]>['pagination'] = {
      totalDocs,
      page,
      pageSize,
      totalPages,
    };

    res.status(200).send(handleResponse<Pagination<Product[]>>(true, { data, pagination }));
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

const count = catchAsync<AuthRequest>(async (_, res) => {
  try {
    const total = await prismaClient.product.count();

    res.status(200).send(handleResponse(true, total));
  } catch (error) {
    logger.error(
      '[product/controller/crud] - count',
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
  count
};
