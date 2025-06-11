// const newsRouter = require('./news');
import newsRouter from './news.js';
import siteRouter from './site.js';

function route(app) {
    app.use('/news', newsRouter);

    app.use('/', siteRouter);
}

export default route;
