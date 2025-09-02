import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_CONNECT) {
      throw new Error("MONGODB_CONNECT env var is missing");
    }

    // Parse the connection string to add required parameters
    let connectionString = process.env.MONGODB_CONNECT;
    
    // Add connection parameters only if they don't already exist
    const params = new URLSearchParams();
    
    if (!connectionString.includes('retryWrites')) {
      params.append('retryWrites', 'true');
    }
    if (!connectionString.includes('w=')) {
      params.append('w', 'majority');
    }
    
    // Add parameters to connection string
    if (params.toString()) {
      if (!connectionString.includes('?')) {
        connectionString += '?';
      } else {
        connectionString += '&';
      }
      connectionString += params.toString();
    }

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default dbConnect;
