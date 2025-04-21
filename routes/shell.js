const express = require('express');
const router = express.Router();
const { logActivity } = require('../utils/logger');

// Simple fake shell page
router.get('/shell', (req, res) => {
  res.send(`
    <h2>Fake Interactive Shell</h2>
    <form method='POST'>
      <input name='cmd' placeholder='Enter command' autofocus style='width:300px;'>
      <button type='submit'>Run</button>
    </form>
    <div id='output'>${req.query.output || ''}</div>
  `);
});

router.post('/shell', (req, res) => {
  const cmd = req.body.cmd;
  logActivity({
    type: 'shell_command',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl,
    command: cmd
  });
  // Always return a fake output
  const fakeOutput = `bash: ${cmd}: command not found`;
  res.redirect(`/shell?output=${encodeURIComponent(fakeOutput)}`);
});

module.exports = router;
