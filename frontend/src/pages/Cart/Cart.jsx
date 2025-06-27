import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../../components/LoginPopup/LoginPopup';

const Cart = () => {
  const { cartItems, food_list, removeItemCompletely, getTotalCartAmount, url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      setShowLoginPopup(true);
    } else {
      navigate('/order');
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + '/images/' + item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}/kg</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p className='cross' onClick={() => removeItemCompletely(item._id)}>X</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery</p>
              <p>Charges applicable during Booking</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have promocode enter here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Show login popup if user is not logged in */}
      {showLoginPopup && <LoginPopup setShowLogin={setShowLoginPopup} />}
    </div>
  );
};

export default Cart;
