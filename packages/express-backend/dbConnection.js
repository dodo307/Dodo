import mongoose from 'mongoose';
import dotenvx from '@dotenvx/dotenvx'

mongoose.set('debug', true);
dotenvx.config();

const uri = process.env.ATLAS_URI
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Connection issue to debug later !!!!!
async function runMongo() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.disconnect();
  }
}

runMongo();

export default runMongo;
