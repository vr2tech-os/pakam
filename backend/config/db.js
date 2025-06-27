import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://pakam:12345@cluster0.4kx9hwe.mongodb.net/food-app').then(()=>console.log("DB connected")); 
}