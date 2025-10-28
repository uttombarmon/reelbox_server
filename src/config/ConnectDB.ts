import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGODB_URI) {
    console.error("MongoDB URI not found in environment variables");
    process.exit(1);
  }
  try {
    
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10 });
    console.log("MongoDB Connected Successfully");
  } catch (error: any) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
