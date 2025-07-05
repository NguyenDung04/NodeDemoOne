class AuthControllers {
    showLogin(req, res) {
        res.render('auth/login', {
            layout: false,
            title: 'Đăng nhập',   
            url: req.originalUrl
        });
    }


    showGoogleLogin(req, res) {
        res.render('auth/googleLogin');
    }

    showRegister(req, res) {
        res.render('auth/register', {
            layout: false,
            title: 'Đăng ký',  
            url: req.originalUrl
        });
    }

    showChangePassword(req, res) {
        res.render('auth/changePassword', {
            layout: false,
            title: 'Đổi mật khẩu',
            url: req.originalUrl
        });
    }
}

export default new AuthControllers();
