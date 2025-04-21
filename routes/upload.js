const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logEvent } = require('../utils/logger');
const { archiveRequest, scanFileWithVirusTotal } = require('../utils/forensics');
const { createJiraTicket, createServiceNowTicket } = require('../utils/ticketing');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/upload', (req, res) => {
  res.send(`
    <h2>Fake File Upload</h2>
    <form method='POST' enctype='multipart/form-data'>
      <input type='file' name='file' required>
      <button type='submit'>Upload</button>
    </form>
  `);
});

router.post('/upload', upload.single('file'), (req, res) => {
  logActivity({
    type: 'file_upload',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
  res.send('<h3>Upload failed: file type not allowed</h3>');
});

module.exports = router;
