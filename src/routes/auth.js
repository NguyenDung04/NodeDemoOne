import express from 'express';
import authController from '../app/controllers/AuthControllers.js';

const router = express.Router();

// Trang đăng nhập thường (local login)
router.get('/login', authController.showLogin);

// Trang đổi mật khẩu
router.get('/changePassword', authController.showChangePassword);

// Trang đăng ký
router.get('/register', authController.showRegister);
router.post('/register', authController.handleRegister);

// Bắt đầu đăng nhập với Google
router.get('/google', authController.showGoogleLogin);

// Xử lý callback sau khi đăng nhập Google
router.get('/google/callback', authController.handleGoogleCallback);

// Đăng xuất
router.get('/logout', authController.logout);

export default router;