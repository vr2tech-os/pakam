import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// 🔐 Create JWT Token with role
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User or Admin
const registerUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    // Check if email already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' });
    }

    // Password strength
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user/admin
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error("Register Error:", error);
    res.json({ success: false, message: 'Registration failed' });
  }
};

// ✅ Login User or Admin
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Login failed" });
  }
};


export { registerUser, loginUser };
