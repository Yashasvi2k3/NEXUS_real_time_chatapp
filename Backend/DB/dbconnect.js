import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_CONNECT) {
      throw new Error("MONGODB_CONNECT env var is missing");
    }

    // Parse the connection string to add required parameters
    let connectionString = process.env.MONGODB_CONNECT;
    
    // Add connection parameters to handle SSL/TLS issues
    if (!connectionString.includes('?')) {
      connectionString += '?';
    } else {
      connectionString += '&';
    }
    
    connectionString += 'directConnection=true&retryWrites=true&w=majority';

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default dbConnect;
