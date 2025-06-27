import mongoose from "mongoose";

// Reusable FAQ sub-schema
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true }
  },
  { _id: false } // No need to create separate _id for each FAQ
);

// Main Food schema
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true, trim: true },
    benefits: { type: String, required: true, trim: true },
    faq: { type: [faqSchema], default: [] }
  },
  {
    timestamps: true // Optional: adds createdAt and updatedAt fields
  }
);

// Avoid model overwrite error in dev environments
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
