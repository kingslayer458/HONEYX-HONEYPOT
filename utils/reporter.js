const cron = require('node-cron');
const { exportLogs } = require('./logger');
const { sendEmailAlert } = require('./alert');

function summarizeLogs(logs) {
  const total = logs.length;
  const byType = logs.reduce((acc, l) => { acc[l.type] = (acc[l.type] || 0) + 1; return acc; }, {});
  const byDay = {};
  logs.forEach(l => {
    const day = l.time ? l.time.slice(0, 10) : 'unknown';
    byDay[day] = (byDay[day] || 0) + 1;
  });
  return { total, byType, byDay };
}

function formatSummary(summary) {
  return `Honeypot Activity Summary\n\nTotal Events: ${summary.total}\nBy Type: ${JSON.stringify(summary.byType)}\nBy Day: ${JSON.stringify(summary.byDay)}`;
}

function scheduleReports() {
  // Every day at 8am
  cron.schedule('0 8 * * *', async () => {
    const logs = await exportLogs('json');
    const summary = summarizeLogs(logs);
    await sendEmailAlert('Daily Honeypot Summary', formatSummary(summary));
  });
  // Every Monday at 8am
  cron.schedule('0 8 * * 1', async () => {
    const logs = await exportLogs('json');
    const summary = summarizeLogs(logs);
    await sendEmailAlert('Weekly Honeypot Summary', formatSummary(summary));
  });
}

module.exports = { scheduleReports };
