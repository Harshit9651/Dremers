const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  try {
    // Get the JWT token from cookies or headers
    const token = req.cookies.jwt || req.headers.authorization;

    if (!token) {
      throw new Error('Authentication failed. Token not provided.');
    }

    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Attach user information to the request object for future use
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed. Please log in.' });
  }
};

module.exports = authenticate;
