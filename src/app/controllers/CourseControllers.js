import Course from '../models/Course.js';
import { multipleMongooseToObject, mongooseToObject } from '../../util/mongoose.js';

class CourseControllers {
    // GET /course
    async index(req, res, next) {
            Course.find({})
            .then(courses => {
                res.render('course', { courses: multipleMongooseToObject(courses) }); // Truyền dữ liệu courses vào view
            })
            .catch(error => {
                next(error); // Gọi next với lỗi để xử lý ở middleware lỗi
            });
    }

    // GET /course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => {
                if (!course) {
                    return res.status(404).send('Course not found');
                }
                res.render('course/show', { course: mongooseToObject(course) });
            })
            .catch(error => {
                next(error); // Gọi next với lỗi để xử lý ở middleware lỗi
            });
    }

    // GET /course/create
    create(req, res, next) {
        res.render('course/create'); // Hiển thị form tạo khóa học
    }

    // POST /course/store 
    async store(req, res, next) {
        try {
            const { name, slug, decription } = req.body;

            // ✅ xử lý ảnh
            let imagePath = '';
            if (req.file) {
                console.log('✅ File đã upload:', req.file); // kiểm tra
                imagePath = '/image/' + req.file.filename;
            } else {
                console.warn('⚠️ Không nhận được file upload!');
            }

            // ✅ tạo và lưu course
            const course = new Course({
                name,
                slug,
                decription,
                img_courses: imagePath, 
            });

            await course.save();
            res.redirect('/course');
        } catch (err) {
            next(err);
        }
    }



}

export default new CourseControllers();
