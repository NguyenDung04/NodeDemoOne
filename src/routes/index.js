import viewRoutes from './view/index.js';
import apiRoutes from './api/index.js';


function route(app) {
    viewRoutes(app);  // gắn /auth, /admin, /course,...
    apiRoutes(app);   // gắn /api/users, /api/courses,...
}

export default route;