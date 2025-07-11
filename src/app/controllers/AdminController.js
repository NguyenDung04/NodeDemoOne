class AdminController {
    // GET /admin/dashboard
    show(req, res) {
        res.render('admin/dashboard', {
            layout: false, 
            title: 'Trang quản trị',
            url: req.originalUrl,
        });
    }
}

export default new AdminController();
