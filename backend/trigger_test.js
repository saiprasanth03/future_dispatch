import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import { runNewsAggregation, runContentGeneration, runInstagramPublishing } from './services/cronScheduler.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-automation');
    console.log('Connected to DB. Running manual trigger...');
    
    // Clear old mock posts to see new changes
    await Post.deleteMany({});
    console.log('Cleared old posts.');

    // 1. Scrape News (Mock)
    await runNewsAggregation();
    
    // 2. Generate Content & Images
    await runContentGeneration();
    
    // 3. Publish to Instagram
    console.log('Publishing to Instagram...');
    await runInstagramPublishing();
    
    console.log('✅ Success! Check your Instagram account to see the live posts!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
