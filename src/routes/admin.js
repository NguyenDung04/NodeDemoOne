import express from 'express';
import adminController from '../app/controllers/AdminController.js';

const router = express.Router();

// GET /dashboard
router.get('/dashboard', adminController.show);

// GET /user
router.get('/userM', adminController.showUser);

// GET /shop
router.get('/shopM', adminController.showShop);

// GET /admin
router.get('/adminM', adminController.showAdmin);

// GET /rolePermission
router.get('/rolePermissionM', adminController.showRolePermission); 

export default router;
