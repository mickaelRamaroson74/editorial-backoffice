import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { validate } from '../middleware/validate';
import { CreateCategorySchema, UpdateCategorySchema } from '../types';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.post('/', validate(CreateCategorySchema), categoryController.create);
router.patch('/:id', validate(UpdateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
