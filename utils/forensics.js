const fs = require('fs');
const path = require('path');
const VT_API_KEY = process.env.VT_API_KEY;
const axios = require('axios');

const forensicsDir = path.join(__dirname, '..', 'forensics');
if (!fs.existsSync(forensicsDir)) fs.mkdirSync(forensicsDir);

async function archiveRequest(event) {
  const ts = event.time || Date.now();
  const file = path.join(forensicsDir, `event_${ts}_${event.id || ''}.json`);
  fs.writeFileSync(file, JSON.stringify(event, null, 2));
}

async function scanFileWithVirusTotal(filepath) {
  if (!VT_API_KEY) return null;
  try {
    const file = fs.createReadStream(filepath);
    const resp = await axios.post('https://www.virustotal.com/api/v3/files', file, {
      headers: {
        'x-apikey': VT_API_KEY,
        'Content-Type': 'application/octet-stream'
      }
    });
    return resp.data;
  } catch (e) {
    return null;
  }
}

module.exports = { archiveRequest, scanFileWithVirusTotal };
