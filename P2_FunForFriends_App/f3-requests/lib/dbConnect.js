import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env.local');

    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fun_for_friends', // Explicit database name
    };

    console.log('MongoDB connection options:', JSON.stringify({
      ...options,
      // Don't log sensitive data
      auth: options.auth ? '***' : undefined,
    }));

    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then(mongoose => {
        console.log('Connected to MongoDB: fun_for_friends');
        
        // Log available collections to debug
        mongoose.connection.db.listCollections().toArray((err, collections) => {
          if (err) {
            console.error('Error listing collections:', err);
          } else {
            console.log('Available collections:', collections.map(c => c.name));
            
            // Check if f3_users collection exists
            const f3UsersExists = collections.some(c => c.name === 'f3_users');
            console.log('f3_users collection exists:', f3UsersExists);
            
            if (!f3UsersExists) {
              console.warn('Warning: f3_users collection not found in database');
            }
          }
        });
        
        return mongoose;
      })
      .catch(error => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to establish database connection:', error);
    throw error;
  }
}

export default dbConnect; 