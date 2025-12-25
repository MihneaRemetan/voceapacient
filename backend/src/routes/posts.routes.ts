import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/posts.controller';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authMiddleware, upload.array('images', 10), createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);

export default router;
