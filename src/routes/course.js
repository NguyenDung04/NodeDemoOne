import express from 'express';
import courseControllers from '../app/controllers/CourseControllers.js';
import upload from '../util/upload.js'; // Giả sử bạn đã cấu hình middleware upload

const router = express.Router();

router.get('/create', courseControllers.create);
router.post('/store', upload.single('img_courses'), courseControllers.store);

router.get('/:slug', courseControllers.show);

router.get('/', courseControllers.index);

export default router;
