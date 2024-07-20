import { Router } from 'express';
import auth from '@app/user/controllers/auth.controller';

const router = Router();

router.post('/refresh-token', auth.refreshToken);

export default router;