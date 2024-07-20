import { NextFunction, Request, Response } from "express";
import moment from 'moment';
import 'colors';

type methods = 'POST' | 'GET' | 'PATCH' | 'DELETE';

const methodsColors = {
  'POST': 'bgGreen',
  'DELETE': 'bgRed',
  'GET': 'bgMagenta',
  'PATCH': 'bgYellow',
}

const getColor = (value: methods) => {
  return String(value[methodsColors[value]]).white;
};

const log = {
  auth: (req: Request, res: Response, next: NextFunction) => {
    const start = moment();
    
    console.log(`${'AUTH'.bgBlack.white} ${getColor(req.method as methods)} ${start.format('HH:mm:ss')} ${req.originalUrl} ${res.statusCode}`);
  
    res.on('finish', () => {
      const end = moment();
      const duration = end.diff(start);
  
      console.log(`${'AUTH'.bgBlack.white} ${getColor(req.method as methods)} ${end.format('HH:mm:ss')} ${req.originalUrl} ${res.statusCode} - ${duration}ms ⏱`);
    });
  
    next();
  },
  unAuth: (req: Request, res: Response, next: NextFunction) => {
    const start = moment();
    
    console.log(`${'UNAUTH'.bgWhite.black} ${getColor(req.method as methods)} ${start.format('HH:mm:ss')} ${req.originalUrl} ${res.statusCode}`);
  
    res.on('finish', () => {
      const end = moment();
      const duration = end.diff(start);
  
      console.log(`${'UNAUTH'.bgWhite.black} ${getColor(req.method as methods)} ${end.format('HH:mm:ss')} ${req.originalUrl} ${res.statusCode} - ${duration}ms ⏱`);
    });
  
    next();
  }
};

export default log;