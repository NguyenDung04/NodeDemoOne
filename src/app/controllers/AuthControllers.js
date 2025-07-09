import passport from 'passport';
import User from '../models/Users.js'; // đường dẫn đúng với dự án của bạn
import bcrypt from 'bcrypt';

class AuthControllers {
    // Trang đăng nhập
    showLogin(req, res) {
        res.render('auth/login', {
            layout: false,
            title: 'Đăng nhập',
            url: req.originalUrl,
        });
    }

    // Xử lý đăng nhập 
    async handleLogin(req, res, next) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.' });
        }

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ error: 'Tài khoản không tồn tại.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Mật khẩu không đúng.' });
            }

            // Đăng nhập với passport
            req.login(user, function (err) {
                if (err) return next(err);
                return res.status(200).json({
                    success: true,
                    message: 'Đăng nhập thành công',
                    redirect: '/',
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi máy chủ' });
        }
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
        const { username, email, password } = req.body;

        try {
            // Kiểm tra tồn tại username/email (bắt buộc nên giữ)
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email hoặc Username đã tồn tại' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ 
                name: username || 'Guest',
                username,
                email,
                password: hashedPassword,
                provider: 'local',
                token: Date.now(),
            });

            // Trả về dữ liệu không chứa password
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

    // ✅ [NEW] Bước 1: Kiểm tra email tồn tại
    async checkEmail(req, res) {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email không được để trống.' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy tài khoản với email này.' });
            }

            res.status(200).json({ success: true, message: 'Email tồn tại' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi máy chủ khi kiểm tra email.' });
        }
    }

    // ✅ [NEW] Bước 2: Đổi mật khẩu mới
    async changePasswordNew(req, res) {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy tài khoản để cập nhật.' });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
            await user.save();

            res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi máy chủ khi đổi mật khẩu.' });
        }
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
            // res.json(req.user);
            res.redirect('/');
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
