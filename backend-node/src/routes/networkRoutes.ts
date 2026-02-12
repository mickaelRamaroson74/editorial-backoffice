import { Router } from 'express';
import { networkController } from '../controllers/networkController';
import { validate } from '../middleware/validate';
import { CreateNetworkSchema, UpdateNetworkSchema } from '../types';

const router = Router();

router.get('/', networkController.getAll);
router.get('/:id', networkController.getOne);
router.post('/', validate(CreateNetworkSchema), networkController.create);
router.patch('/:id', validate(UpdateNetworkSchema), networkController.update);
router.delete('/:id', networkController.remove);

export default router;
