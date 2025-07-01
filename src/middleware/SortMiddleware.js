
export default function SortMiddleware(req, res, next) {
    // Initialize default sorting values
    res.locals._sort = {
        enabled: false,
        type: req.query.type || 'default'
    };

    // Kiểm tra xem có tham số sort trong query không
    if (req.query && req.query._sort !== undefined) {
        Object.assign(res.locals._sort, {
            enabled: req.query._sort === 'true', // Kiểm tra xem có bật sắp xếp không
            column: req.query.column || 'name', // Mặc định sắp xếp theo
            type: req.query.type || 'asc' // Mặc định kiểu sắp xếp
        });
    }

    next();
}
