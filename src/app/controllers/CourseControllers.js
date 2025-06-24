import Course from '../models/Course.js';
import { multipleMongooseToObject, mongooseToObject } from '../../util/mongoose.js';
import slugify from 'slugify';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

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

    // GET /course/management
    async management(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('course/management', { courses: multipleMongooseToObject(courses) });
        } catch (err) {
            next(err);
        }
    }

    // POST /course/add
    async add(req, res, next) {
        try {
            const { name, description } = req.body;
            const slug = slugify(name, { lower: true, strict: true });

            // ✅ xử lý ảnh
            let imagePath = '';
            if (req.file) {
                imagePath = '/image/' + req.file.filename;

            } else {
                console.warn('⚠️ Không nhận được file upload!');
            }

            // ✅ tạo và lưu course
            const course = new Course({
                name,
                slug,
                description,
                img_courses: imagePath, 
            });

            await course.save();
            res.redirect('/course/management?success=created');
        } catch (err) {
            next(err);
        }
    }

    // POST /course/update/:id
    async update(req, res, next) {
        try {
            const { name, description } = req.body;
            const id = req.params.id; // lấy id từ URL thay vì req.body

            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).send('Course not found');
            }

            // Cập nhật tên và slug nếu tên thay đổi
            if (name && name !== course.name) {
                course.name = name;
                course.slug = slugify(name, { lower: true, strict: true });
            }

            // Cập nhật mô tả nếu thay đổi
            if (description && description !== course.description) {
                course.description = description;
            }

            // Nếu có ảnh mới thì cập nhật ảnh
            if (req.file) {
                const newImagePath = '/image/' + req.file.filename;
                course.img_courses = newImagePath;
            }

            await course.save();

            res.redirect('/course/management?success=updated');
        } catch (err) {
            next(err);
        }
    }
    
    // POST /course/delete/:id
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await Course.delete({ _id: id }); // soft delete

            res.redirect('/course/management?success=deleted');
        } catch (err) {
            next(err);
        }
    }
    
    // GET /course/trash
    async trash(req, res, next) {
        Promise.all([Course.findDeleted({ deletedAt: { $ne: null } }), Course.countDocumentsDeleted()])
            .then(([courses, deleteCount]) => {
                res.render('course/trash', {
                    courses: multipleMongooseToObject(courses),
                    deleteCount,
                });
            })
            .catch(error => {
                next(error); // Gọi next với lỗi để xử lý ở middleware lỗi
            });
    } 

    // PATCH /course/restore/:id
    async restore(req, res, next) {
        try {
            const id = req.params.id;
            await Course.restore({ _id: id });

            // Gửi JSON response cho client-side xử lý
            res.status(200).json({ message: 'Khôi phục thành công' });
        } catch (err) {
            res.status(500).json({ message: 'Khôi phục thất bại', error: err.message });
        }
    }

    // DELETE /course/delete/:id/force
    async forceDelete(req, res, next) {
        try {
            const id = req.params.id;

            // ✅ Sử dụng findOneWithDeleted để lấy bản ghi đã xóa mềm
            const course = await Course.findOneWithDeleted({ _id: id });

            if (!course) {
                return res.status(404).json({ message: 'Không tìm thấy khóa học' });
            }

            // (Tùy chọn) Xóa ảnh vật lý nếu có
            if (course.img_courses && course.img_courses.startsWith('/image/')) {
                const imagePath = path.join('public', course.img_courses);
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Không thể xóa ảnh:', err.message);
                });
            }

            // ✅ Xóa vĩnh viễn khỏi DB
            await Course.deleteOne({ _id: id });

            res.status(200).json({ message: 'Đã xóa vĩnh viễn khóa học' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi xóa khóa học', error: err.message });
        }
    }
}

export default new CourseControllers();
