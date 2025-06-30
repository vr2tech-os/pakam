import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Verify.css';

const Verify = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const razorpay_order_id = query.get("razorpay_order_id");
  const razorpay_payment_id = query.get("razorpay_payment_id");
  const razorpay_signature = query.get("razorpay_signature");
  const orderId = query.get("orderId");
  const userName = query.get("name") ? decodeURIComponent(query.get("name")) : "Customer";
  const urlSuccess = query.get("success");

  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(`${baseURL}/order/verify`, {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderId,
        });

        setSuccess(response.data.success === true);
      } catch (error) {
        console.error("Verification Error:", error);
        setSuccess(false);
      }
    };

    // ✅ If user redirected with verification params, do backend verification
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature && orderId) {
      verifyPayment();
    } else if (urlSuccess === "false") {
      setSuccess(false);
    } else if (urlSuccess === "true") {
      setSuccess(true); // fallback if payment already verified
    }
  }, []);

  return (
    <div className="verify-page">
      <div className="verify-box">
        {success === null ? (
          <p>Verifying your payment...</p>
        ) : success ? (
          <>
            <img src="/payment_success.png" alt="Success" className="verify-img" />
            <h2>
              Hi {userName}!<br />
              Thank you, your order has been placed successfully.
            </h2>
            <p><strong>Order ID:</strong> {orderId}</p>
            <div className="promo-banner">
              <p>
                <i>
                  We're pleased to take more orders — <span className="highlight">Place 3 orders</span> this month & get{" "}
                  <span className="reward">₹200 OFF</span> on your <span className="highlight">4<sup>th</sup> order!</span>
                </i>
              </p>
            </div>
            <a href="/" className="back-home">Back to Home</a>
          </>
        ) : (
          <>
            <img src="/failed.png" alt="Failure" className="verify-img" />
            <h2>Oops! Something went wrong.</h2>
            <p>Your payment could not be verified.</p>
            <a href="/" className="back-home">Try Again</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
