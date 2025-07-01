class AuthControllers {
    index(req, res) {
        res.render('auth/login');
    }

    success(req, res) {
        if (!req.user) return res.redirect('/');
        res.render('auth/success', {
            user: req.user,
        });
    }

    logout(req, res, next) {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    }
}

export default new AuthControllers();
