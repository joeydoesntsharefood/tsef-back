import { Router } from 'express';
import crud from '@app/provider/controllers/crud.controller';

const router = Router();

router.post('/', crud.create);

router.get('/', crud.find);
router.get('/:id', crud.index);
router.get('/data/country-codes', crud.getCountryCodes);
router.get('/data/count', crud.count);
 
router.patch('/:id', crud.edit);

router.delete('/:id', crud.deleteRow);

export default router;