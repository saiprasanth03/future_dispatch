import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  caption: { type: String, required: true },
  hashtags: { type: [String], required: true },
  slidesText: { type: [mongoose.Schema.Types.Mixed], required: true },
  status: { type: String, enum: ['generated', 'published', 'failed'], default: 'generated' },
  instagramPostId: { type: String },
  scheduledFor: { type: Date },
  publishedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
