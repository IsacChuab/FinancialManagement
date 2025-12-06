import 'dotenv/config';
import './auth';
import { connectDB } from './db.js';
import { listen } from './server.js';

(async () => {
  console.log(`Starting Server`);

  try {
    await Promise.all([connectDB()]);
    await listen();
  } catch (error) {
    console.error('Error starting API:', error);
    process.exit(1);
  }
})();
