import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  await mongoose.connect(mongoURI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection failed:", err));
};
