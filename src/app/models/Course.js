import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Course = new Schema({
  name: { type: String, default: 'Guest', maxLength: 100 },
  img_courses: { type: String, default: 'No image' },
  description: { type: String, default: 'No description', maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Course', Course);
