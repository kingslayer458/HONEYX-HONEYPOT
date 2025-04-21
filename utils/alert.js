const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require('axios');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PHONE = process.env.ADMIN_PHONE;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;

async function sendEmailAlert(subject, text) {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Change as needed
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  await transporter.sendMail({ from: SMTP_USER, to: ADMIN_EMAIL, subject, text });
}

//async function sendSmsAlert(body) {
//  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
//  await client.messages.create({ body, from: TWILIO_PHONE, to: ADMIN_PHONE });
//}

async function sendSlackAlert(message) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
}

module.exports = { sendEmailAlert, sendSlackAlert };
