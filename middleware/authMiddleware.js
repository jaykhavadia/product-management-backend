const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

// Middleware to protect routes and check user roles
const protect = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user and exclude the password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Attach user to the request object
    req.user = user;

    // Check if the user has the required role (optional)
    if (req.role && !req.role.includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

// Role-based validation middleware
const authorize = (roles = []) => {
  // roles param can be a single role or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.length) {
      return next(); // No roles means all users can access
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have the required role' });
    }

    next();
  };
};

module.exports = { protect, authorize };
