const axios = require('axios');
const dgram = require('dgram');

// HTTP Forwarding (Splunk, ELK, Graylog HTTP input)
async function forwardHttp(log) {
  if (!process.env.SIEM_HTTP_URL) return;
  try {
    await axios.post(process.env.SIEM_HTTP_URL, log, {
      headers: process.env.SIEM_HTTP_TOKEN ? { 'Authorization': `Bearer ${process.env.SIEM_HTTP_TOKEN}` } : {}
    });
  } catch (e) {
    // Optionally log error
  }
}

// Syslog Forwarding (UDP)
function forwardSyslog(log) {
  if (!process.env.SIEM_SYSLOG_HOST || !process.env.SIEM_SYSLOG_PORT) return;
  const message = Buffer.from(JSON.stringify(log));
  const client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, parseInt(process.env.SIEM_SYSLOG_PORT), process.env.SIEM_SYSLOG_HOST, () => {
    client.close();
  });
}

function forwardToSiem(log) {
  forwardHttp(log);
  forwardSyslog(log);
}

module.exports = { forwardToSiem };
