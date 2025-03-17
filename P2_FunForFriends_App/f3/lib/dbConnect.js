import mongoose from 'mongoose';

// Cache the MongoDB connection to prevent multiple connections during development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<Mongoose>} Mongoose connection
 */
async function dbConnect() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    // // Ensure we're connecting to the correct database
    // // Parse the URI to check if it already has a database name
    // let uri = MONGODB_URI;
    // if (!uri.includes('/fun_for_friends')) {
    //   // If no database is specified in the URI, add it
    //   if (uri.endsWith('/')) {
    //     uri += 'fun_for_friends';
    //   } else if (!uri.split('/').pop().includes('?')) {
    //     uri += '/fun_for_friends';
    //   } else {
    //     // If there are query parameters but no database
    //     const parts = uri.split('/');
    //     const lastPart = parts.pop();
    //     if (lastPart.includes('?')) {
    //       parts.push('fun_for_friends');
    //       parts.push(lastPart);
    //       uri = parts.join('/');
    //     }
    //   }
    // }

    // Updated options - removed deprecated options
    const options = {
      // These options are no longer needed in newer Mongoose versions
      // but kept for backward compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fun_for_friends', // Explicitly set the database name
    };

    // Set strictQuery to prepare for future Mongoose versions
    mongoose.set('strictQuery', false);

    cached.promise = mongoose.connect(uri, options)
      .then((mongoose) => {
        console.log('Connected to MongoDB - fun_for_friends database');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  // Wait for connection to be established
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 