import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) return null;
  return mongoose.connect(process.env.MONGODB_URI);
}
