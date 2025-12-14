import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditOrder = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    productName: '',
    quantity: '',
    price: '',
    status: 'Pending'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`);
      setFormData({
        customerName: response.data.customerName,
        productName: response.data.productName,
        quantity: response.data.quantity,
        price: response.data.price,
        status: response.data.status
      });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/orders/${id}`, formData);
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating order');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="edit-order">
          <p style={{ textAlign: 'center' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="edit-order">
        <h1>Edit Order</h1>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Update Order</button>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
