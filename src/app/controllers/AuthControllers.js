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
            console.error('[Login] Thiếu username hoặc password:', { username, password });
            return res.status(400).json({ error: 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.' });
        }

        try {
            const user = await User.findOne({ username });
            if (!user) {
                console.error('[Login] Tài khoản không tồn tại:', username);
                return res.status(401).json({ error: 'Tài khoản không tồn tại.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.error('[Login] Sai mật khẩu cho user:', username);
                return res.status(401).json({ error: 'Mật khẩu không đúng.' });
            }

            req.login(user, function (err) {
                if (err) {
                    console.error('[Login] Lỗi khi gọi req.login:', err);
                    return next(err);
                }

                req.session.user = {
                    name: user.name,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    currentMoney: user.currentMoney,
                    level: user.level,
                    isBanned: user.isBanned,
                    deleted: user.deleted,
                };

                return res.status(200).json({
                    success: true,
                    message: 'Đăng nhập thành công',
                    redirect: '/',
                });
            });

        } catch (error) {
            console.error('[Login] Lỗi máy chủ:', error);
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

        if (!username || !email || !password) {
            console.error('[Register] Thiếu dữ liệu:', { username, email, password });
            return res.status(400).json({ error: 'Thiếu thông tin đăng ký.' });
        }

        try {
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                console.error('[Register] Email hoặc username đã tồn tại:', { username, email });
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

            const { password: pw, ...userData } = newUser.toObject();
            return res.status(201).json(userData);

        } catch (err) {
            console.error('[Register] Đăng ký lỗi:', err);
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
    
    // Bước 1: Kiểm tra email tồn tại
    async checkEmail(req, res) {
        const { email } = req.body;
        if (!email) {
            console.error('[Check Email] Email trống');
            return res.status(400).json({ error: 'Email không được để trống.' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.error('[Check Email] Không tìm thấy email:', email);
                return res.status(404).json({ error: 'Không tìm thấy tài khoản với email này.' });
            }

            res.status(200).json({ success: true, message: 'Email tồn tại' });
        } catch (err) {
            console.error('[Check Email] Lỗi máy chủ:', err);
            res.status(500).json({ error: 'Lỗi máy chủ khi kiểm tra email.' });
        }
    }
    
    // Bước 2: Đổi mật khẩu
    async changePasswordNew(req, res) {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            console.error('[Change Password] Thiếu email hoặc mật khẩu mới');
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.error('[Change Password] Không tìm thấy user với email:', email);
                return res.status(404).json({ error: 'Không tìm thấy tài khoản để cập nhật.' });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
            await user.save();

            res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công.' });
        } catch (err) {
            console.error('[Change Password] Lỗi khi cập nhật:', err);
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
    
    // Callback Google
    handleGoogleCallback(req, res, next) {
        passport.authenticate('google', {
            failureRedirect: '/auth/login',
        }, (err, user) => {
            if (err || !user) {
                console.error('[Google Callback] Lỗi xác thực:', err);
                return res.redirect('/auth/login');
            }

            req.login(user, (err) => {
                if (err) {
                    console.error('[Google Callback] Lỗi khi gọi req.login:', err);
                    return res.redirect('/auth/login');
                }

                req.session.user = {
                    name: user.name,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    currentMoney: user.currentMoney,
                    level: user.level,
                    isBanned: user.isBanned,
                    deleted: user.deleted,
                };

                return res.redirect('/');
            });
        })(req, res, next);
    }

    // Đăng xuất và xóa session
    logout(req, res) { 
        req.logout(() => {
            req.session.destroy(() => {
                res.clearCookie('connect.sid'); 
                res.redirect('/auth/login');
            });
        });

    }
}

export default new AuthControllers();