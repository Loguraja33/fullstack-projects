import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:20',message:'fetchStats called',data:{hasAuthHeader:!!axios.defaults.headers.common['Authorization']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    try {
      const response = await axios.get('/api/orders');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:23',message:'fetchStats success',data:{status:response.status,ordersCount:response.data?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      const orders = response.data;
      
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'Pending').length;
      const processingOrders = orders.filter(o => o.status === 'Processing').length;
      const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
      const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      const totalRevenue = orders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, o) => sum + (o.price * o.quantity), 0);

      setStats({
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue
      });
      setLoading(false);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Dashboard.jsx:44',message:'fetchStats error',data:{errorMessage:error.message,responseStatus:error.response?.status,responseMessage:error.response?.data?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Processing</h3>
          <p className="stat-number">{stats.processingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Shipped</h3>
          <p className="stat-number">{stats.shippedOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Delivered</h3>
          <p className="stat-number">{stats.deliveredOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/orders" className="btn-primary">View All Orders</Link>
        <Link to="/orders/create" className="btn-primary">Create New Order</Link>
      </div>
    </div>
  );
};

export default Dashboard;
