import { User } from "@prisma/client";
import { Request } from "express";

export interface LoginResponse { 
  user: Omit<User, 'password'>;
  tokens: {
    accessToken: {
      token: string;
      expiresIn: moment.Moment;
    };
    refreshToken: {
      token: string;
      expiresIn: moment.Moment;
    };
  }
};

export interface AuthRequest extends Request {
  user: Omit<User, 'password'>,
}