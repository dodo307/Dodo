// dbConnection.js
import mongoose from 'mongoose';
import dotenvx from '@dotenvx/dotenvx';

// Needed to prenvent [MISSING_ENV_FILE] error
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenvx.config({ path: path.resolve(__dirname, '.env') });

mongoose.set('debug', true);

const uri = process.env.ATLAS_URI;

export default async function connectMongo() {
  try {
    await mongoose.connect(uri, {
      serverApi: { version: '1' },
      serverSelectionTimeoutMS: 8000, // fail fast instead of hanging
    });

    // Will throw if the connection isn't actually usable
    await mongoose.connection.db.admin().ping();

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB startup failed:', err?.message);
    throw err;
  }
}
