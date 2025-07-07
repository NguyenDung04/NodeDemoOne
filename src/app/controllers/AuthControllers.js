import passport from 'passport';

class AuthControllers {
    // Trang đăng nhập
    showLogin(req, res) {
        res.render('auth/login', {
            layout: false,
            title: 'Đăng nhập',
            url: req.originalUrl,
        });
    }

    // Trang đăng ký
    showRegister(req, res) {
        res.render('auth/register', {
            layout: false,
            title: 'Đăng ký',
            url: req.originalUrl,
        });
    }

    // Xử lý đăng ký
    async handleRegister(req, res) {
        const { username, email, password, confirmPassword } = req.body;

        // Validate
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Mật khẩu không khớp' });
        }

        try {
            // Kiểm tra tồn tại username/email
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email hoặc Username đã tồn tại' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name: username, // bạn có thể tách thêm trường 'name' nếu muốn
                username,
                email,
                password: hashedPassword,
                provider: 'local',
                token: 'local-register-' + Date.now(), // hoặc sinh ngẫu nhiên
            });

            // In ra thông tin user (bỏ password)
            const { password: pw, ...userData } = newUser.toObject();
            return res.status(201).json(userData);

        } catch (err) {
            console.error('Đăng ký lỗi:', err);
            return res.status(500).json({ error: 'Đăng ký thất bại' });
        }
    }

    // Trang đổi mật khẩu
    showChangePassword(req, res) {
        res.render('auth/changePassword', {
            layout: false,
            title: 'Đổi mật khẩu',
            url: req.originalUrl,
        });
    }

    // Gọi passport để chuyển sang Google OAuth
    showGoogleLogin(req, res, next) {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account', // ép người dùng chọn tài khoản mỗi lần
        })(req, res, next);
    }

    // Callback sau khi xác thực Google
    handleGoogleCallback(req, res, next) {
        passport.authenticate('google', {
            failureRedirect: '/auth/login',
        })(req, res, () => {
            // ✅ In JSON user ra sau khi đăng nhập thành công
            res.json(req.user);

            // Nếu muốn redirect thay vì in JSON:
            // res.redirect('/profile'); // hoặc bất kỳ route nào bạn muốn
        });
    }

    // Đăng xuất và xóa session
    logout(req, res) {
        req.logout(() => {
            res.redirect('/auth/login');
        });
    }
}

export default new AuthControllers();
