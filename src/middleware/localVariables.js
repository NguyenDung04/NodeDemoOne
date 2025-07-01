import Course from '../app/models/Course.js';

export default async function setGlobalVariables(req, res, next) {
    // Biến thông tin người dùng (nếu có)
    res.locals.user = req.user || null;

    // Biến thông báo (nếu có)
    res.locals.success_msg = req.session.success_msg || null;
    res.locals.error_msg = req.session.error_msg || null;
    res.locals.error = req.session.error || null;

    // Xoá flash sau khi hiển thị
    delete req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.error;

    // Biến số lượng khoá học đã bị xoá mềm (deleted)
    try {
        const count = await Course.countDocumentsDeleted({ deletedAt: { $ne: null } });
        res.locals.deleteCount = count;
    } catch (err) {
        res.locals.deleteCount = 0;
    }

    next();
}
