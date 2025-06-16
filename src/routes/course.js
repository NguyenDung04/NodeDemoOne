import express from 'express';
import courseControllers from '../app/controllers/CourseControllers.js';
import upload from '../util/upload.js';

const router = express.Router();

router.post('/delete', courseControllers.delete);
router.post('/update', upload.single('img_courses'), courseControllers.update); 
router.post('/add', upload.single('img_courses'), courseControllers.add);
router.get('/management', courseControllers.management);

router.get('/:slug', courseControllers.show);
router.get('/', courseControllers.index);

export default router;
