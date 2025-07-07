import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; 
import bcrypt from 'bcrypt';
import User from '../app/models/Users.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value;

                // Tìm user theo googleId hoặc email
                let user = await User.findOne({
                    $or: [{ googleId }, { email }],
                });

                // Nếu chưa có thì tạo mới
                if (!user) {
                    const dummyPassword = googleId + Date.now();
                    const hashedPassword = await bcrypt.hash(dummyPassword, 10);

                    user = await User.create({
                        googleId: googleId,
                        name: profile.displayName || 'Người dùng Google',
                        email: email || `no-email-${Date.now()}@google.com`,
                        password: hashedPassword,
                        provider: 'google',
                        role: 'user',
                        avatarUrl: profile.photos?.[0]?.value || undefined,
                        token: accessToken,
                    });
                } else {
                    // Nếu đã tồn tại → chỉ cập nhật token mới
                    user.token = accessToken;
                    await user.save();
                }

                // Đưa user vào session
                return done(null, user.toObject());
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Xử lý session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user?.toObject());
    } catch (err) {
        done(err, null);
    }
});
