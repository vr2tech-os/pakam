import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Verify.css';

const Verify = () => {
  const query = new URLSearchParams(useLocation().search);
  const razorpay_order_id = query.get("razorpay_order_id");
  const razorpay_payment_id = query.get("razorpay_payment_id");
  const razorpay_signature = query.get("razorpay_signature");
  const orderId = query.get("orderId");
  const userName = decodeURIComponent(query.get("name") || "Customer");
  const urlSuccess = query.get("success"); // get ?success=true from backend redirect

  const [success, setSuccess] = useState(null); // null = loading

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/order/verify", {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderId,
        });

        if (response.data.success) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setSuccess(false);
      }
    };

    // ✅ Priority: if success=true from backend, just show success
    if (urlSuccess === "true") {
      setSuccess(true);
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature && orderId) {
      verifyPayment(); // fallback if not already verified server-side
    } else {
      setSuccess(false); // fallback: failed if nothing provided
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
              Hi {userName}! <br />
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
