const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const centralLogPath = path.join(__dirname, '..', 'central-logs.jsonl');

// Central log receiver endpoint
router.post('/api/log', (req, res) => {
  // Simple API key check (add more security as needed)
  const apiKey = req.headers['x-api-key'];
  if (!process.env.CENTRAL_API_KEY || apiKey !== process.env.CENTRAL_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  fs.appendFileSync(centralLogPath, JSON.stringify(req.body) + '\n');
  res.json({ status: 'ok' });
});

module.exports = router;
