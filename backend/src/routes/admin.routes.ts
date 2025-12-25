import { Router } from 'express';
import {
    getPendingPosts,
    approvePost,
    rejectPost,
    updatePost,
    addAttachment,
    deleteAttachment,
    getPostForEdit,
    deletePost
} from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/posts/pending', getPendingPosts);
router.get('/posts/:id', getPostForEdit);
router.put('/posts/:id/approve', approvePost);
router.put('/posts/:id/reject', rejectPost);
router.put('/posts/:id', updatePost);
router.post('/posts/:id/attachments', upload.single('image'), addAttachment);
router.delete('/posts/:id/attachments/:attachmentId', deleteAttachment);
router.delete('/posts/:id', deletePost);

export default router;
