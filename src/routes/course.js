import express from 'express';
import courseControllers from '../app/controllers/CourseControllers.js';

const router = express.Router();

router.get('/', courseControllers.index);

export default router;
