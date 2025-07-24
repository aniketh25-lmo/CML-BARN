const jwt = require('jsonwebtoken');
const Manager = require('../models/manager');

const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // you can also call this req.manager based on role
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// middleware/authMiddleware.js


const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Make sure your JWT payload includes email
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Token is invalid" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token missing" });
  }
};

module.exports = { verifyAdminToken, protect }; // ✅ NOW THIS MATCHES YOUR adminroute.js
