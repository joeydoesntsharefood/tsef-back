import { Router } from "express";
import provider from '@app/provider/routes/crud.route';
import product from '@app/product/routes/crud.route';

const auth = Router();

auth.use('/provider', provider);
auth.use('/product', product);

export default auth;