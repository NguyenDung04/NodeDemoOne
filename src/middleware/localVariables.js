import Course from '../app/models/Course.js';

export default async function setGlobalVariables(req, res, next) {
    try {
        const count = await Course.countDocumentsDeleted({ deletedAt: { $ne: null } });
        res.locals.deleteCount = count;
    } catch (err) {
        res.locals.deleteCount = 0;
    }

    next();
}
