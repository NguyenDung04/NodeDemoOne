import express from 'express';
import adminController from '../app/controllers/AdminController.js';

const router = express.Router();

// GET /
router.get('/', adminController.index);

export default router;
