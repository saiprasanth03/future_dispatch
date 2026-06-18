import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'scrape_news', 'generate_post', 'publish_instagram'
  status: { type: String, enum: ['success', 'error', 'info'], required: true },
  message: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model('Log', logSchema);
