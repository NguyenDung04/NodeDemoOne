import express from 'express';
import newsController from '../app/controllers/NewsControllers.js';

const router = express.Router();

router.get('/:slug', newsController.show);
    
router.get('/', newsController.index);

export default router;
