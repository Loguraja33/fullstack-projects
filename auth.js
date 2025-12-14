const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:5',message:'authenticate middleware',data:{path:req.path,hasAuthHeader:!!req.header('Authorization')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/616f2db0-fdce-42be-9ffe-2d6799f3dffd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:9',message:'authenticate no token',data:{path:req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Validate JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET is not set' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware for role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
