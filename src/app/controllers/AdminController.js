class AdminController {
    // GET /admin/dashboard
    show(req, res) {
        res.render('admin/dashboard', {
            layout: false, 
            title: 'Trang quản trị',
            url: req.originalUrl,
        });
    }

    // GET /admin/userM
    showUser(req, res) {
        res.render('admin/userM', {
            layout: false, 
            title: 'Trang quản lý người dùng',
            url: req.originalUrl,
        });
    }

    // GET /admin/shopM
    showShop(req, res) {
        res.render('admin/shopM', {
            layout: false, 
            title: 'Trang quản lý cửa hàng',
            url: req.originalUrl,
        });
    }

    // GET /admin/adminM
    showAdmin(req, res) {
        res.render('admin/adminM', {
            layout: false, 
            title: 'Trang quản lý quản trị viên',
            url: req.originalUrl,
        });
    }

    // GET /admin/rolePermission
    showRolePermission(req, res) {
        res.render('admin/rolePermissionM', {
            layout: false, 
            title: 'Trang quản lý quyền hạn và vai trò',
            url: req.originalUrl,
        });
    }
}

export default new AdminController();
