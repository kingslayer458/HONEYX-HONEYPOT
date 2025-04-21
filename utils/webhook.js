const axios = require('axios');

async function triggerWebhook(event, data) {
  if (!process.env.WEBHOOK_URL) return;
  try {
    await axios.post(process.env.WEBHOOK_URL, { event, data });
  } catch (e) {
    // Optionally log webhook errors
  }
}

module.exports = { triggerWebhook };
