const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exportLogs } = require('../utils/logger');
const { requireAuth } = require('../middleware/auth');

// Dashboard (requires auth)
// Redirect to new dashboard UI
router.get('/dashboard', requireAuth, (req, res) => {
  res.redirect('/dashboard.html');
});

// API endpoints for new dashboard widgets
router.get('/api/dashboard/timeline', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const byDay = {};
  logs.forEach(l => { const d = l.time ? l.time.slice(0,10) : 'unknown'; byDay[d] = (byDay[d]||0)+1; });
  res.json({ labels: Object.keys(byDay), values: Object.values(byDay) });
});
router.get('/api/dashboard/typepie', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const byType = {};
  logs.forEach(l => { byType[l.type] = (byType[l.type]||0)+1; });
  res.json({ labels: Object.keys(byType), values: Object.values(byType) });
});
router.get('/api/dashboard/topattackers', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const byIP = {};
  logs.forEach(l => { if(l.ip) byIP[l.ip] = (byIP[l.ip]||0)+1; });
  const sorted = Object.entries(byIP).sort((a,b)=>b[1]-a[1]).slice(0,8);
  res.json({ labels: sorted.map(x=>x[0]), values: sorted.map(x=>x[1]) });
});
router.get('/api/dashboard/mappoints', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const points = logs.filter(l=>l.geo&&l.geo.latitude&&l.geo.longitude).map(l=>[l.geo.latitude,l.geo.longitude]);
  res.json(points);
});
router.get('/api/dashboard/livefeed', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const feed = logs.slice(-20).reverse();
  res.json(feed);
});
router.get('/api/dashboard/logs', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  res.json(logs.slice(-100));
});

// Top Ports
router.get('/api/dashboard/topports', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const byPort = {};
  logs.forEach(l => { if(l.port) byPort[l.port] = (byPort[l.port]||0)+1; });
  const sorted = Object.entries(byPort).sort((a,b)=>b[1]-a[1]).slice(0,8);
  res.json({ labels: sorted.map(x=>x[0]), values: sorted.map(x=>x[1]) });
});
// Protocol Breakdown
router.get('/api/dashboard/protopie', requireAuth, async (req, res) => {
  const logs = await exportLogs('json');
  const byProto = {};
  logs.forEach(l => { if(l.proto) byProto[l.proto] = (byProto[l.proto]||0)+1; });
  res.json({ labels: Object.keys(byProto), values: Object.values(byProto) });
});
// (Legacy HTML dashboard code removed; all widgets are now served via /dashboard.html and API endpoints)


// Export endpoints (require auth)
router.get('/export/json', requireAuth, (req, res) => {
  const logs = exportLogs('json');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(logs, null, 2));
});

router.get('/export/csv', requireAuth, async (req, res) => {
  await exportLogs('csv');
  res.download(path.join(__dirname, '..', 'honeypot.csv'));
});

module.exports = router;
