import { Router } from 'express';
import * as pagosController from '../controllers/pagos.controller';
const router = Router();

router.get('/', pagosController.getPagosList);
router.get('/:id', pagosController.getPagosItem);
router.post('/', pagosController.postPagosItem);
router.post('/multiples', pagosController.insertManyPagosItems);
router.patch('/:id', pagosController.patchPagosItem); // Ruta para el PATCH
router.put('/:id', pagosController.putPagosItem);
router.delete('/:id', pagosController.deletePagosItem);
export default router;