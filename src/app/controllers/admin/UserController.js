// 📁 controllers/admin/UserController.js
export default {
    show(req, res) {
        res.render('admin/userM', {
            layout: false,
            title: 'Trang quản lý người dùng',
            url: req.originalUrl,
        });
    },
};