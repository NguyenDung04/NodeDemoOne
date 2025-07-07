import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import session from 'express-session';           // ✅ Bổ sung dòng này
import passport from 'passport';                 // ✅ Khởi tạo passport

// Load biến môi trường từ .env
dotenv.config();

// Kết nối MongoDB
import connectDB from './config/db/index.js';
connectDB();

// Cấu hình passport Google
import './config/passport.js';

// Middleware custom
import setGlobalVariables from './middleware/localVariables.js';

// Route chính
import route from './routes/index.js';

const app = express();
const port = 3000;

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Logger (tuỳ chọn)
// app.use(morgan('dev'));

// Template engine: handlebars
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            inc: (value) => parseInt(value) + 1,
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// ✅ Session setup (đặt TRƯỚC passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ✅ Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Biến toàn cục (req.user, v.v...)
app.use(setGlobalVariables);

// ✅ Routing
route(app);

// ✅ Khởi chạy server
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
