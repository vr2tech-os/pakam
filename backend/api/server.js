import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from '../config/db.js';

import foodRouters from '../routes/foodRoute.js';
import userRouter from '../routes/userRoute.js';
import cartRouter from '../routes/cartRoute.js';
import orderRouter from '../routes/orderRoute.js';

dotenv.config();

const app = express();

// ✅ ES module fix to use __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS for frontend
app.use(cors({
  origin: 'https://pakam-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Static folder for uploaded images
app.use('/images', express.static(path.join(__dirname, '../uploads')));

// ✅ API Routes
app.use('/api/food', foodRouters);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
