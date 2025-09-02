const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT Bearer token.
 * Looks for Authorization: Bearer <token>
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Missing Authorization header' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Clear error message to indicate env var required
      return res.status(500).json({ status: 'error', message: 'Server misconfiguration: JWT_SECRET not set' });
    }
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
}

/**
 * Middleware factory for role-based access control.
 * @param {string[]} roles Allowed roles
 */
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthenticated' });
    if (roles.length === 0) return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
