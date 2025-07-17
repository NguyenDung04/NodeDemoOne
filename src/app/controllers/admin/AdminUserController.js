// 📁 controllers/admin/AdminUserController.js
export default {
    show(req, res) {
        res.render('admin/adminM', {
            layout: false,
            title: 'Trang quản lý quản trị viên',
            url: req.originalUrl,
        });
    },
};