import { Request, Response, NextFunction } from 'express';

function catchAsync<T = Request> (fn: (req: T, res: Response, next: NextFunction) => void) { 
  return (req: T, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
}
export default catchAsync;