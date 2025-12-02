// dbConnection.js
import mongoose from 'mongoose';
import dotenvx from '@dotenvx/dotenvx';

// Needed to prenvent [MISSING_ENV_FILE] error
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use the committed .env.test during Jest runs so CI and local tests don't need secrets
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenvx.config({ path: path.resolve(__dirname, envFile) });

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
