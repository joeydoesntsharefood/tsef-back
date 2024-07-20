import jwt from 'jsonwebtoken';
import variables from '@setup/variables';

const { secretKey } = variables;

const generateToken = (payload: object, expiresIn: string | number): string => {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

export default generateToken;