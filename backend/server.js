import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/output', express.static(path.join(__dirname, 'output')));

import { runNewsAggregation, runContentGeneration, runInstagramPublishing } from './services/cronScheduler.js';
import Article from './models/Article.js';
import Post from './models/Post.js';
import Log from './models/Log.js';

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Instagram Automation API is running' });
});

// Dashboard Endpoints
app.get('/api/stats', async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const totalPosts = await Post.countDocuments();
    const recentLogs = await Log.find().sort({ createdAt: -1 }).limit(10);
    res.json({ totalArticles, totalPosts, recentLogs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/news', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(50);
    res.json(articles);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(20).populate('articles');
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Trigger Endpoints
app.post('/api/trigger/:task', async (req, res) => {
  const { task } = req.params;
  try {
    if (task === 'aggregate') {
      runNewsAggregation(); // Fire and forget so we don't block
      res.json({ success: true, message: 'Aggregation started in background' });
    } else if (task === 'generate') {
      runContentGeneration();
      res.json({ success: true, message: 'Generation started in background' });
    } else if (task === 'publish') {
      runInstagramPublishing();
      res.json({ success: true, message: 'Publishing started in background' });
    } else {
      res.status(400).json({ error: 'Unknown task' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-automation')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 8:00 AM: Fetch News & Filter
cron.schedule('0 8 * * *', async () => {
  console.log('Running 8:00 AM Task: News Aggregation & Filtering...');
  await runNewsAggregation();
});

// 8:15 AM: Generate Content & Images
cron.schedule('15 8 * * *', async () => {
  console.log('Running 8:15 AM Task: Content & Carousel Generation...');
  await runContentGeneration();
});

// 9:00 AM: Publish to Instagram
cron.schedule('0 9 * * *', async () => {
  console.log('Running 9:00 AM Task: Instagram Publishing...');
  await runInstagramPublishing();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
