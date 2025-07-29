const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data.json');

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    return { doctors: [], patients: [], appointments: [], availability: [] };
  }
  const text = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(text || '{"doctors":[],"patients":[],"appointments":[],"availability":[]}');
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
