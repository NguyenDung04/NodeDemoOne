// 📁 controllers/admin/ShopController.js
export default {
    show(req, res) {
        res.render('admin/shopM', {
            layout: false,
            title: 'Trang quản lý cửa hàng',
            url: req.originalUrl,
        });
    },
};