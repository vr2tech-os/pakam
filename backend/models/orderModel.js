// models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Food Processing' },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentId: { type: String },
  orderId: { type: String }
}, {
  timestamps: true // ✅ This adds `createdAt` and `updatedAt`
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
