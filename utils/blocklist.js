const fs = require('fs');
const path = require('path');
const blocklistPath = path.join(__dirname, '..', 'blocklist.json');

function loadBlocklist() {
  if (!fs.existsSync(blocklistPath)) return [];
  return JSON.parse(fs.readFileSync(blocklistPath, 'utf-8'));
}

function saveBlocklist(list) {
  fs.writeFileSync(blocklistPath, JSON.stringify(list, null, 2));
}

function addToBlocklist(ip) {
  const list = loadBlocklist();
  if (!list.includes(ip)) {
    list.push(ip);
    saveBlocklist(list);
  }
}

function isBlocked(ip) {
  return loadBlocklist().includes(ip);
}

module.exports = { addToBlocklist, isBlocked, loadBlocklist };
