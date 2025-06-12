import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Course = new Schema({
  name: { type: String, default: 'Guest', maxLength: 100 },
  img_courses: { type: String, default: 'No image' },
  decription: { type: String, default: 'No decription', maxLength: 500 },
  slug: { type: String, slug: "name", unique: true, required: true, maxLength: 100 },
}, {
  timestamps: true,
});

export default mongoose.model('Course', Course);
