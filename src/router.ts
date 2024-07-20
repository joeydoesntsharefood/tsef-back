import { Router } from 'express';
import provider from '@app/provider/routes/crud.route';
import product from '@app/product/routes/crud.route';

const router = Router();

router.use('/provider', provider);
router.use('/product', product);

export default router;