import express from 'express';
import authControllers from '../app/controllers/AuthControllers.js';

const router = express.Router();

router.get('/login', authControllers.showLogin); 

router.get('/login/google', authControllers.showGoogleLogin); 

router.get('/register', authControllers.showRegister); 

router.get('/change-password', authControllers.showChangePassword); 

export default router;