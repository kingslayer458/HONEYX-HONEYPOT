const bcrypt = require('bcryptjs');

// For demo: Store hashed password in env (in production, use a DB!)
const ADMIN_USER = process.env.DASHBOARD_USER || 'admin';
const ADMIN_HASH = process.env.DASHBOARD_PASS_HASH || '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // bcrypt hash

function isAuthenticated(req) {
  return req.session && req.session.authenticated;
}

function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  next();
}

async function verifyLogin(username, password) {
  if (username !== ADMIN_USER) return false;
  return bcrypt.compare(password, ADMIN_HASH);
}

module.exports = { requireAuth, verifyLogin, isAuthenticated };
