class AdminController {
    // GET /
    index(req, res) {
        res.render('home');
    }
}

export default new AdminController();
