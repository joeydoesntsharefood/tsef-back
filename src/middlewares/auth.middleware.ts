import prismaClient from "@db/prisma";
import variables from "@setup/variables";
import handleResponse from "@utils/handleReturn";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json(handleResponse(false, 'Token not provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const verify = jwt.verify(token, variables.secretKey);
    
    if (typeof verify === 'string')
      res.status(401).json(handleResponse(false, 'Invalid or expired token'));
    
    const decoded = jwt.decode(token);
    
    const user = await prismaClient
      .user
      .findUnique(
        { 
          where: { email: (decoded as unknown as { email: string }).email },
          select: { email: true, createdAt: true, id: true, name: true, updatedAt: true }
        },
      );

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json(handleResponse(false, 'Invalid or expired token'));
  }
};

export default authMiddleware;