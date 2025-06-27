import React, { useState, useEffect } from 'react';
import './Order.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Server error');
      console.error("Fetch error:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.put(`${url}/api/order/update-status`, {
      orderId,
      status: newStatus,
    });
    if (response.data.success) {
      toast.success('Status updated');
      fetchAllOrders(); // Refresh orders
    } else {
      toast.error('Failed to update status');
    }
  } catch (error) {
    console.error("Update status error:", error);
    toast.error('Error updating status');
  }
};

const statusHandler = (event, orderId) => {
  const newStatus = event.target.value;
  updateStatus(orderId, newStatus);
};

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : 'N/A';

          const address = order.address || {};

          return (
            <div key={index} className='order-item'>
              {/* Parcel Icon */}
              <div className="order-col image-col">
                <img src={assets.parcel_icon} alt="parcel" />
              </div>

              {/* Items */}
              <div className="order-col">
                <strong>Items:</strong><br />
                {order.items.map(item => (
                  <span key={item._id}>{item.name} x {item.quantity}<br /></span>
                ))}
              </div>

              {/* Amount */}
              <div className="order-col">
                <strong>Total:</strong><br />₹{order.amount}
              </div>

              {/* Date */}
              <div className="order-col">
                <strong>Ordered On:</strong><br />
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  
              </div>
                  
              {/* Payment & Status */}
              <div className="order-col">
                <strong>Payment ID:</strong><br />{order.paymentId || 'N/A'}<br />
                <strong>Status:</strong><br />
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

              </div>
              {/* Delivery Info */}
              <div className="order-col">
                <strong>Delivery Info:</strong><br />
                {address.firstName || ''} {address.lastName || ''}<br />
                📧 {address.email || 'N/A'}<br />
                📍 {address.street}, {address.city}, {address.state}<br />
                {address.zipcode}, {address.country}<br />
                📞 {address.phone || 'N/A'}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
