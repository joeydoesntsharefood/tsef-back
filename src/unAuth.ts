import { Router } from "express";
import authController from "@app/user/controllers/auth.controller";
import utilsController from "@app/user/controllers/utils.controller";

const unAuth = Router();

unAuth.use('/login', authController.login);
unAuth.use('/register', authController.register);
unAuth.use('/utils', utilsController.refreshToken);

export default unAuth;