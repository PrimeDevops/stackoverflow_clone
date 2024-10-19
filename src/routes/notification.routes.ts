import { Router } from 'express';
import { sendEmailNotification } from '../controllers/notification.controller';

const router = Router();

router.post('/send-email', sendEmailNotification);

export default router;
