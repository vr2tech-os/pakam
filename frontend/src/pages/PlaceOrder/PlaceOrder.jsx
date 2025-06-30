import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [data, setData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    try {
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({ ...item, quantity: cartItems[item._id] }));

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2
      };

      const res = await axios.post(`${url}/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data.success) throw new Error('Failed to create order');

      const { razorpayOrderId, amount, currency, key, orderId } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: 'Pakam Swagruha Foods',
        description: 'Food Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${url}/order/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
              address: data,
              items: orderItems,
              amount: getTotalCartAmount() + 2
            });

            const fullName = encodeURIComponent(`${data.firstName} ${data.lastName}`);
            const redirectURL = verifyRes.data.success
              ? `/verify?razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}&orderId=${verifyRes.data.orderId}&name=${fullName}`
              : `/verify?success=false`;

            window.location.href = redirectURL;
          } catch (err) {
            console.error("Payment verification failed:", err);
            window.location.href = `/verify?success=false`;
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        notes: {
          address: `${data.street}, ${data.city}, ${data.state} - ${data.zipcode}, ${data.country}`
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong during order placement.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-field">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' />
        <div className="multi-field">
          <input required name='city' onChange={onChangeHandler} value={data.city} placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} placeholder='State' />
        </div>
        <div className="multi-field">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zipcode' />
          <input required name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>₹{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery</p><p>₹2</p></div>
            <hr />
            <div className="cart-total-details total">
              <p><strong>Total</strong></p>
              <p><strong>₹{getTotalCartAmount() + 2}</strong></p>
            </div>
          </div>
          <button type='submit' disabled={isPlacingOrder}>
            {isPlacingOrder ? 'Processing...' : 'PROCEED TO PAYMENT'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
