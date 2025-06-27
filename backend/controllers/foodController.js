import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
  try {
    let image_filename = req.file.filename;

    const faq = JSON.parse(req.body.faq); // Parsed from frontend JSON

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      ingredients: req.body.ingredients,
      benefits: req.body.benefits,
      faq: faq,
      image: image_filename
    });

    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error adding food item' });
  }
};

// Get all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find(); // returns all fields
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error fetching food list' });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food?.image) {
      fs.unlink(`uploads/${food.image}`, () => {});
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Food Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error removing food item' });
  }
};

export { addFood, listFood, removeFood };
