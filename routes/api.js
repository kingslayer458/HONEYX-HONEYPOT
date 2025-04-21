const express = require('express');
const router = express.Router();
const { logActivity } = require('../utils/logger');

// Dummy users
router.get('/api/users', (req, res) => {
  logActivity({
    type: 'api_users',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl
  });
  res.json([
    { id: 1, username: 'admin', password: 'admin123' },
    { id: 2, username: 'user', password: 'userpass' }
  ]);
});

// Dummy data endpoint
router.post('/api/data', (req, res) => {
  logActivity({
    type: 'api_data',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl,
    body: req.body
  });
  res.json({ status: 'error', message: 'Invalid API key' });
});

module.exports = router;
