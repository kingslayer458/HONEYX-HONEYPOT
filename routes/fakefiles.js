const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logActivity } = require('../utils/logger');

const fakeFiles = [
  { route: '/config', filename: 'fake-config.json', content: '{ "db": "root", "pass": "password123" }' },
  { route: '/db', filename: 'fake-db.sql', content: '-- SQL Dump\nCREATE TABLE users (id INT, name VARCHAR(100));' },
  { route: '/backup.zip', filename: 'fake-backup.zip', content: 'This is not a real zip.' }
];

fakeFiles.forEach(file => {
  router.get(file.route, (req, res) => {
    logActivity({
      type: 'fakefile_access',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      time: new Date().toISOString(),
      path: req.originalUrl,
      file: file.filename
    });
    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.send(file.content);
  });
});

module.exports = router;
