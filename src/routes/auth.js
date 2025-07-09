import express from 'express';
import authController from '../app/controllers/AuthControllers.js';

const router = express.Router();

// Hiện thị trang đăng nhập
router.get('/login', authController.showLogin);

// Xử lý đăng nhập thường (local login)
router.post('/login', authController.handleLogin); 

// Hiện thị trang đổi mật khẩu
router.get('/changePassword', authController.showChangePassword);

// ✅ Kiểm tra email tồn tại (bước 1)
router.post('/checkEmail', authController.checkEmail);

// ✅ Đổi mật khẩu mới (bước 2)
router.post('/changePasswordNew', authController.changePasswordNew);

// Hiện thị trang đăng ký
router.get('/register', authController.showRegister);
router.post('/register', authController.handleRegister);

// Bắt đầu đăng nhập với Google
router.get('/google', authController.showGoogleLogin);

// Xử lý callback sau khi đăng nhập Google
router.get('/google/callback', authController.handleGoogleCallback);

// Đăng xuất
router.get('/logout', authController.logout);

export default router;