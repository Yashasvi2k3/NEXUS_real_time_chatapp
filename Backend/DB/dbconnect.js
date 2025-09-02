import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_CONNECT) {
      throw new Error("MONGODB_CONNECT env var is missing");
    }

    await mongoose.connect(process.env.MONGODB_CONNECT, {
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
