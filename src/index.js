import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import setGlobalVariables from './middleware/localVariables.js';
import sortMiddleware from './middleware/SortMiddleware.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // load cấu hình passport

// Importing necessary modules
import route from './routes/index.js';

// Importing database connection
import connectDB from './config/db/index.js';
// Connect to MongoDB
connectDB();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
// Body parser middleware and JSON parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Sort middleware
app.use(sortMiddleware);

// HTTP logger
// app.use(morgan('combined'))

// Template engine setup
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            inc: (value) => parseInt(value) + 1,
        },
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views')); 

// Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set global variables
app.use(setGlobalVariables);

// Importing routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
