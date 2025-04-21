const axios = require('axios');

async function getGeolocation(ip) {
  try {
    const resp = await axios.get(`https://ipapi.co/${ip}/json/`);
    return resp.data;
  } catch {
    return {};
  }
}

async function checkAbuseIPDB(ip) {
  if (!process.env.ABUSEIPDB_API_KEY) return null;
  try {
    const resp = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip },
      headers: { Key: process.env.ABUSEIPDB_API_KEY, Accept: 'application/json' }
    });
    return resp.data.data;
  } catch {
    return null;
  }
}

// Shodan enrichment
async function shodanLookup(ip) {
  if (!process.env.SHODAN_API_KEY) return null;
  try {
    const resp = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${process.env.SHODAN_API_KEY}`);
    return resp.data;
  } catch {
    return null;
  }
}

// Censys enrichment
async function censysLookup(ip) {
  if (!process.env.CENSYS_API_ID || !process.env.CENSYS_API_SECRET) return null;
  try {
    const resp = await axios.get(`https://search.censys.io/api/v2/hosts/${ip}`, {
      auth: {
        username: process.env.CENSYS_API_ID,
        password: process.env.CENSYS_API_SECRET
      }
    });
    return resp.data;
  } catch {
    return null;
  }
}

// VirusTotal enrichment
async function vtLookup(ip) {
  if (!process.env.VT_API_KEY) return null;
  try {
    const resp = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
      headers: { 'x-apikey': process.env.VT_API_KEY }
    });
    return resp.data;
  } catch {
    return null;
  }
}

// WHOIS enrichment (using https://www.whoisxmlapi.com/ as example)
async function whoisLookup(ip) {
  if (!process.env.WHOIS_API_KEY) return null;
  try {
    const resp = await axios.get('https://www.whoisxmlapi.com/whoisserver/WhoisService', {
      params: { apiKey: process.env.WHOIS_API_KEY, ip: ip, outputFormat: 'JSON' }
    });
    return resp.data;
  } catch {
    return null;
  }
}

// Passive DNS enrichment (using https://api.passivedns.com/ as example)
async function passiveDnsLookup(ip) {
  if (!process.env.PASSIVEDNS_API_KEY) return null;
  try {
    const resp = await axios.get(`https://api.passivedns.com/v1/ip/${ip}`, {
      headers: { 'Authorization': `Bearer ${process.env.PASSIVEDNS_API_KEY}` }
    });
    return resp.data;
  } catch {
    return null;
  }
}

module.exports = {
  getGeolocation,
  checkAbuseIPDB,
  shodanLookup,
  censysLookup,
  vtLookup,
  whoisLookup,
  passiveDnsLookup
};

