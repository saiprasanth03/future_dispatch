import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  source: { type: String, required: true },
  summary: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  score: { type: Number, default: 0 },
  selectedForPost: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);
