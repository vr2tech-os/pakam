import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import foodRouters from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use('/api/food', foodRouters);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/images', express.static('uploads'));

// Base route
app.get('/', (req, res) => {
  res.send('API Working');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Export serverless handler for Vercel
export const handler = serverless(app);
