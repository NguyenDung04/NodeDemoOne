// Importing necessary modules
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';

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

// HTTP logger
// app.use(morgan('combined'))

// Template engine setup
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Importing routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
