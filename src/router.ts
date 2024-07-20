import { Router } from 'express';
import auth from './auth';
import unAuth from './unAuth';
import log from '@middlewares/log.middleware';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.use('', log.unAuth, unAuth);
router.use('/auth', log.auth, authMiddleware, auth);

export default router;