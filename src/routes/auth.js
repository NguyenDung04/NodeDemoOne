import express from 'express';
import passport from 'passport';
import authControllers from '../app/controllers/AuthControllers.js';

const router = express.Router();

router.get('/', authControllers.index);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/auth/success');
});

router.get('/success', authControllers.success);

router.get('/logout', authControllers.logout);

export default router;
