import siteRouter from './site.js';
import courseRouter from './course.js';
import authRouter from './auth.js';

function route(app) {
    app.use('/auth', authRouter);

    app.use('/course', courseRouter);

    app.use('/', siteRouter);
}

export default route;
