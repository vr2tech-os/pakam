// 📁 controllers/cartController.js
import userModel from '../models/userModel.js';
import foodModel from '../models/foodModel.js'; // Ensure this import exists

// ✅ Add to cart with quantity support
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity = 1 } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    cartData[itemId] = (cartData[itemId] || 0) + quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: `${quantity} item(s) added to Cart` });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.json({ success: false, message: "Error while adding to cart" });
  }
};

// ✅ Remove item from current user's cart only — product remains in global DB
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

    if (cartData[itemId]) {
      delete cartData[itemId];
      await userModel.findByIdAndUpdate(userId, { cartData });

      return res.json({
        success: true,
        message: "Item removed from your cart only (product still available for others)",
      });
    } else {
      return res.json({ success: false, message: "Item not found in your cart" });
    }

  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.json({ success: false, message: "Error while removing from cart" });
  }
};

// ✅ Get cart data (with item details and quantity)
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    // Get full product details for all itemIds
    const itemIds = Object.keys(cartData);
    const products = await foodModel.find({ _id: { $in: itemIds } });

    // Attach quantity to each product
    const cartItems = products.map(product => ({
      ...product._doc,
      quantity: cartData[product._id.toString()] || 1
    }));

    res.json({ success: true, cartItems }); // ✅ frontend should use cartItems
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.json({ success: false, message: "Error while fetching cart" });
  }
};
