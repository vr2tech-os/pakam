import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading orders...</p> 
      ) : orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="orders-container">
          {orders.map((order, index) => {
            const itemSummary = order.items.map(item => item.name).join(', ');
            const totalQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
            const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div key={index} className="order-row">
                <img src={assets.parcel_icon} alt="parcel" className="order-icon" />
                <div className="order-summary">
                  {itemSummary}
                  <div className="order-date">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                </div>
                <div className="order-price">Total Amount: ₹{order.amount}</div>
                <div className="order-count">Quantity: {totalQuantity}</div>
                <div className="order-status">
                  <span className="status-dot"></span> {order.status || 'Processing'}
                </div>
                <div className="track-button">
                  <button onClick={fetchOrders}>Track Order</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
