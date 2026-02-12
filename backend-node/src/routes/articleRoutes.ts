import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { validate } from '../middleware/validate';
import { CreateArticleSchema, UpdateArticleSchema } from '../types';

const router = Router();

router.get('/', articleController.getAll);
router.get('/:id', articleController.getOne);
router.post('/', validate(CreateArticleSchema), articleController.create);
router.patch('/:id', validate(UpdateArticleSchema), articleController.update);
router.delete('/:id', articleController.remove);

export default router;
