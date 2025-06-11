import courseModel from '../models/Course.js';

class CourseControllers {
    // GET /course
    async index(req, res) {
        try {
            const courses = await courseModel.find({}).lean(); // CHÚ Ý: thêm `.lean()`
            console.log(courses);
            res.json(courses); // In ra JSON trực tiếp
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new CourseControllers();
