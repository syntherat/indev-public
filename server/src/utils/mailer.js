const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function isMailerConfigured() {
  return Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass && env.mailFrom);
}

function getTransporter() {
  if (!isMailerConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return transporter;
}

async function sendMail({ to, cc, subject, text, html, icalEvent, replyTo }) {
  const tx = getTransporter();

  if (!tx) {
    throw new Error("SMTP mailer is not configured");
  }

  return tx.sendMail({
    from: env.mailFrom,
    to,
    cc,
    replyTo,
    subject,
    text,
    html,
    ...(icalEvent ? { icalEvent } : {}),
  });
}

module.exports = {
  isMailerConfigured,
  sendMail,
};
