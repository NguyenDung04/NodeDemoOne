import express from 'express';
import adminController from '../app/controllers/AdminController.js';

const router = express.Router();

// GET /dashboard
router.get('/dashboard', adminController.show);

export default router;
