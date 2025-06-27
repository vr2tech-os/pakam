import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role: {
    type: String,
    enum: ['user', 'admin'], // 👈 restricts role to 'user' or 'admin'
    default: 'user',         // 👈 default role is user
  },
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
