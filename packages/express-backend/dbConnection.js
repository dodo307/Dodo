// dbConnection.js
import mongoose from 'mongoose';
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

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
