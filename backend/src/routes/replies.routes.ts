import { Router } from 'express';
import { createReply, getReplies } from '../controllers/replies.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/:id/replies', authMiddleware, createReply);
router.get('/:id/replies', getReplies);

export default router;
