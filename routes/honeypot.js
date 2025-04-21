const express = require('express');
const router = express.Router();
const { logActivity } = require('../utils/logger');
const { sendEmailAlert, sendSmsAlert, sendSlackAlert } = require('../utils/alert');
const { getGeolocation, checkAbuseIPDB } = require('../utils/threatintel');
const rateLimitMap = new Map();
const bruteForceThreshold = 5;
const bruteForceWindowMs = 10 * 60 * 1000; // 10 minutes
const { addToBlocklist, isBlocked } = require('../utils/blocklist');
const { triggerWebhook } = require('../utils/webhook');

// Helper to detect attack patterns
function detectAttackPatterns(body) {
  const patterns = [/('|\").*(--|#|;)/i, /<script.*?>/i, /select.*from/i, /union.*select/i];
  return patterns.some((pat) => pat.test(JSON.stringify(body)));
}

// Middleware for session tracking and IP block
router.use((req, res, next) => {
  if (isBlocked(req.ip)) {
    logActivity({ type: 'blocked_access', ip: req.ip, time: new Date().toISOString(), path: req.originalUrl });
    return res.status(403).send('<h3>Your IP is blocked.</h3>');
  }
  req.sessionID = req.sessionID || req.session?.id || Math.random().toString(36).slice(2);
  next();
});

// GET fake admin page
router.get('/admin', async (req, res) => {
  const geo = await getGeolocation(req.ip);
  const abuse = await checkAbuseIPDB(req.ip);
  logActivity({
    type: 'visit',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl,
    headers: req.headers,
    geo,
    abuse,
    sessionID: req.sessionID
  });
  res.send('<h2>Admin Login</h2><form method=\'POST\'><input name=\'username\' placeholder=\'Username\'><br><input name=\'password\' type=\'password\' placeholder=\'Password\'><br><button type=\'submit\'>Login</button></form>');
});

// POST fake admin login
router.post('/admin', async (req, res) => {
  // Rate limiting
  const now = Date.now();
  const ipData = rateLimitMap.get(req.ip) || { count: 0, first: now };
  ipData.count += 1;
  if (now - ipData.first > bruteForceWindowMs) {
    ipData.count = 1;
    ipData.first = now;
  }
  rateLimitMap.set(req.ip, ipData);

  const geo = await getGeolocation(req.ip);
  const abuse = await checkAbuseIPDB(req.ip);
  const isAttack = detectAttackPatterns(req.body);
  const activity = {
    type: 'login_attempt',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    geo,
    abuse,
    sessionID: req.sessionID,
    isAttack,
    bruteForce: ipData.count
  };
  logActivity(activity);

  let alertMsg = `Honeypot Alert:\nIP: ${activity.ip}\nUser-Agent: ${activity.userAgent}\nTime: ${activity.time}\nGeo: ${geo.city||''}, ${geo.country_name||''}\nAbuse Score: ${(abuse && abuse.abuseConfidenceScore) || 'N/A'}\nUsername: ${activity.body.username}\nBruteForce Count: ${ipData.count}\nAttack Pattern: ${isAttack}`;
  try {
    await sendEmailAlert('Honeypot Alert', alertMsg);
    await sendSmsAlert(alertMsg);
    await sendSlackAlert(alertMsg);
  } catch (e) {
    logActivity({ type: 'alert_error', error: e.toString(), time: new Date().toISOString() });
  }

  if (ipData.count > bruteForceThreshold) {
    addToBlocklist(req.ip);
    triggerWebhook('brute_force_block', activity);
    res.send('<h3>Too many attempts. Your IP is now blocked.</h3>');
  } else if (isAttack) {
    triggerWebhook('attack_pattern', activity);
    res.send('<h3>Suspicious input detected.</h3>');
  } else {
    res.send('<h3>Access Denied</h3>');
  }
});

module.exports = router;
