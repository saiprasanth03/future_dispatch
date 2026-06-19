import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Log from './models/Log.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-automation');
    const logs = await Log.find().sort({ createdAt: -1 }).limit(15);
    console.log("=== LATEST SYSTEM LOGS ===");
    logs.forEach(log => {
      console.log(`[${log.createdAt.toISOString()}] ${log.action} (${log.status}): ${log.message}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
