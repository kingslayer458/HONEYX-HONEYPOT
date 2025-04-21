const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { forwardToSiem } = require('./siem');

const logPath = path.join(__dirname, '..', 'honeypot.log');

async function logActivity(data) {
  data.id = uuidv4();
  fs.appendFileSync(logPath, JSON.stringify(data) + '\n');

  // Threat intelligence enrichment
  try {
    const { shodanLookup, censysLookup, vtLookup, whoisLookup, passiveDnsLookup } = require('./threatintel');
    if (data.ip) {
      data.shodan = await shodanLookup(data.ip);
      data.censys = await censysLookup(data.ip);
      data.virustotal = await vtLookup(data.ip);
      data.whois = await whoisLookup(data.ip);
      data.passivedns = await passiveDnsLookup(data.ip);
    }
  } catch (e) { /* Optionally log threat intel errors */ }

  // SIEM forwarding
  forwardToSiem(data);

  // Webhook
  try {
    const { triggerWebhook } = require('./webhook');
    triggerWebhook('honeypot_event', data);
  } catch (e) { /* Optionally log webhook errors */ }

  // Email/SMS alerts
  try {
    const { sendEmailAlert, sendSmsAlert } = require('./alert');
    if (process.env.ADMIN_EMAIL) {
      sendEmailAlert('Honeypot Event', JSON.stringify(data, null, 2));
    }
    if (process.env.ADMIN_PHONE) {
      sendSmsAlert(`[HONEYPOT] Event: ${data.type || 'unknown'} from ${data.ip || 'unknown'}`);
    }
  } catch (e) { /* Optionally log alert errors */ }

  // Forward to central aggregator if configured
  if (process.env.CENTRAL_URL && process.env.CENTRAL_API_KEY) {
    try {
      await axios.post(
        process.env.CENTRAL_URL + '/api/log',
        data,
        { headers: { 'x-api-key': process.env.CENTRAL_API_KEY } }
      );
    } catch (e) {
      // Optionally log central forwarding errors
    }
  }
}

function exportLogs(format = 'json') {
  const content = fs.readFileSync(logPath, 'utf-8').trim().split('\n').map(line => JSON.parse(line));
  if (format === 'csv') {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '..', 'honeypot.csv'),
      header: Object.keys(content[0] || {}).map(key => ({ id: key, title: key }))
    });
    return csvWriter.writeRecords(content);
  }
  return content;
}

module.exports = { logActivity, exportLogs };
