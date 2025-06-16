import newsRouter from './news.js';
import siteRouter from './site.js';
import courseRouter from './course.js';

function route(app) {
    app.use('/news', newsRouter);

    app.use('/course', courseRouter);

    app.use('/', siteRouter);
}

export default route;
