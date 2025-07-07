import Course from '../app/models/Course.js';

export default async function setGlobalVariables(req, res, next) {
    // Biến thông tin người dùng (nếu có)
    res.locals.user = req.user || null;

    // Biến số lượng khoá học đã bị xoá mềm (deleted)
    try {
        const count = await Course.countDocumentsDeleted({ deletedAt: { $ne: null } });
        res.locals.deleteCount = count;
    } catch (err) {
        res.locals.deleteCount = 0;
    }

    next();
}
