import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:9',message:'AuthProvider initialized',data:{hasToken:!!token,tokenLength:token?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:12',message:'AuthContext useEffect',data:{hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:19',message:'login called',data:{email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:25',message:'login success',data:{status:response.status,hasToken:!!response.data?.token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:30',message:'login error',data:{errorMessage:error.message,responseStatus:error.response?.status,responseMessage:error.response?.data?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
