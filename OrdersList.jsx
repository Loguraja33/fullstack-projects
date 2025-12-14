import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${id}`);
        setOrders(orders.filter(order => order._id !== id));
      } catch (error) {
        alert('Error deleting order');
      }
    }
  };

  if (loading) {
    return (
      <div className="orders-list">
        <div className="page-header">
          <h1>Orders</h1>
        </div>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="page-header">
        <h1>Orders</h1>
        <Link to="/orders/create" className="btn-primary">Create New Order</Link>
      </div>
      {error && <p className="error" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      {orders.length === 0 ? (
        <p className="no-orders">No orders found. <Link to="/orders/create">Create your first order</Link></p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>${order.price.toFixed(2)}</td>
                  <td>${(order.price * order.quantity).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.createdBy?.name || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/orders/edit/${order._id}`} className="btn-edit">Edit</Link>
                      <button onClick={() => handleDelete(order._id)} className="btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
