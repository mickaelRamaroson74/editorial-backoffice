import { Router } from 'express';
import { emailNotificationController } from '../controllers/emailNotificationController';
import { validate } from '../middleware/validate';
import { CreateEmailNotificationSchema } from '../types';

const router = Router();

router.get('/', emailNotificationController.getAll);
router.post('/', validate(CreateEmailNotificationSchema), emailNotificationController.create);

export default router;
