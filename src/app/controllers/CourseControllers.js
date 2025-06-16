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

    // POST /course/update
    async update(req, res, next) {
        try {
            const { id, name, description } = req.body;
            const course = await Course.findById(id);

            if (!course) {
                return res.status(404).send('Course not found');
            }

            // Chỉ cập nhật nếu name thay đổi
            if (name && name !== course.name) {
                course.name = name;
                course.slug = slugify(name, { lower: true, strict: true });
            }

            // Chỉ cập nhật nếu description thay đổi
            if (description && description !== course.description) {
                course.description = description;
            }

            // Chỉ cập nhật ảnh nếu có ảnh mới
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

    // POST /course/delete
    async delete(req, res, next) {
        try {
            const { id } = req.body;

            if (!id || id.trim() === '') {
            return res.status(400).send('ID không hợp lệ');
            }

            await Course.findByIdAndDelete(id);
            res.redirect('/course/management?success=deleted');
        } catch (err) {
            next(err);
        }
    }
}

export default new CourseControllers();
