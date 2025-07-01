import newsRouter from './news.js';
import siteRouter from './site.js';
import courseRouter from './course.js';
import authRouter from './auth.js';

function route(app) {
    app.use('/auth', authRouter);

    app.use('/news', newsRouter);

    app.use('/course', courseRouter);

    app.use('/', siteRouter);
}

export default route;
