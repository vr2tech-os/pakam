import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, userOrders, listOrders, updateStatus } from '../controllers/orderController.js';
import { verifyPayment } from '../controllers/verifyPayment.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyPayment);
orderRouter.post('/userorders', authMiddleware, userOrders); // ✅ fixed
orderRouter.get('/list', listOrders)
orderRouter.put('/update-status', updateStatus);


export default orderRouter;
