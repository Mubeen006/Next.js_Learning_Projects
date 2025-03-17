import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env.local');

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fun_for_friends', // Explicit database name
    };

    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then(mongoose => {
        console.log('Connected to MongoDB: fun_for_friends');
        return mongoose;
      })
      .catch(error => {
        console.error('Connection error:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 