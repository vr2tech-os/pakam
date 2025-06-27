import crypto from 'crypto';
import Order from '../models/orderModel.js';
import nodemailer from 'nodemailer';

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // ✅ Step 1: Verify Razorpay Signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, msg: "Invalid payment signature" });
    }

    // ✅ Step 2: Fetch Order
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    // ✅ Step 3: Prevent double updates
    if (existingOrder.payment === true) {
      return res.status(200).json({ success: true, msg: "Payment already verified", orderId });
    }

    // ✅ Step 4: Update payment details
    existingOrder.payment = true;
    existingOrder.paymentId = razorpay_payment_id;
    existingOrder.orderId = razorpay_order_id;
    existingOrder.date = new Date(); // Updated order date
    await existingOrder.save();

    // ✅ Step 5: Send Emails
    const customerEmail = existingOrder.address?.email || "";
    await sendEmails(customerEmail, {
      ...existingOrder.toObject(),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    // ✅ Step 6: Response to frontend
    res.status(200).json({
      success: true,
      msg: "Payment verified and order updated",
      orderId: existingOrder._id
    });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ✅ Email sending function
const sendEmails = async (customerEmail, orderData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const itemsHtml = orderData.items.map(item =>
    `<li>${item.name} - Qty: ${item.quantity} - ₹${item.price}/kg - Total: ₹${item.quantity * item.price}</li>`
  ).join("");

  const address = orderData.address;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd;">
    <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
      <h2>Pakam Swagruha Foods</h2>
      <p>Authentic Telangana Sweets & Snacks</p>
    </div>
    <div style="padding: 20px;">
      <h2>Order Confirmation</h2>
      <p><strong>Name:</strong> ${address.firstName} ${address.lastName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${address.phone}</p>
      <p><strong>Address:</strong> ${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>
      <h3>Items Ordered:</h3>
      <ul>${itemsHtml}</ul>
      <h3>Payment Details:</h3>
      <p><strong>Amount Paid:</strong> ₹${orderData.amount}</p>
      <p><strong>Payment ID:</strong> ${orderData.paymentId}</p>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    </div>
    <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px;">
      &copy; 2025 Pakam Swagruha Foods | Made with ❤️ in Telangana
    </div>
  </div>
  `;

  // Send to customer
  await transporter.sendMail({
    from: 'Pakam Foods <info@vr2tech.in>',
    to: customerEmail,
    subject: "Your Pakam Order is Confirmed 🎉",
    html
  });

  // Send to admin
  await transporter.sendMail({
    from: 'Pakam Foods <info@vr2tech.in>',
    to: process.env.ADMIN_EMAIL,
    subject: "New Order Received - Pakam",
    html
  });
};
