const { isMailerConfigured, sendMail } = require("./mailer");

const INBOX_EMAIL = "hello@indevdigital.com";

function getMessageRef(message) {
  return message?.messageRef || (message?.id ? `MSG-${String(message.id).slice(0, 8).toUpperCase()}` : "");
}

function buildSummary(message) {
  return [
    `Message ID: ${getMessageRef(message)}`,
    `Name: ${message.clientName}`,
    `Email: ${message.clientEmail}`,
    `Topic: ${message.topic}`,
    `Message: ${message.message}`,
  ].join("\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendMessageReceivedEmail(message) {
  if (!isMailerConfigured()) {
    return false;
  }

  const subject = "We received your message";
  const messageRef = getMessageRef(message);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #f8f8f8; padding: 20px; }
    .container { max-width: 520px; margin: 0 auto; }
    .wrapper { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 48px 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04); }
    .header { margin-bottom: 40px; border-bottom: 2px solid #000000; padding-bottom: 20px; }
    .logo { font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #000000; text-transform: uppercase; }
    .content { color: #333333; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #000000; }
    .message { font-size: 14px; line-height: 1.7; margin-bottom: 32px; color: #555555; }
    .section { margin-bottom: 28px; }
    .section-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #000000; margin-bottom: 8px; }
    .section-value { font-size: 14px; color: #333333; word-break: break-word; }
    .message-box { background: #fafafa; border-left: 4px solid #000000; padding: 16px 16px; margin-top: 8px; font-size: 13px; line-height: 1.6; color: #444444; }
    .divider { height: 1px; background: #e0e0e0; margin: 32px 0; }
    .footer { font-size: 12px; color: #777777; line-height: 1.6; }
    .footer-text { margin: 8px 0; }
    .ref-code { font-family: 'Monaco', 'Courier New', monospace; font-size: 13px; color: #000000; font-weight: 600; letter-spacing: 0.5px; }
    .highlight { font-weight: 600; color: #000000; }
    @media (max-width: 480px) {
      .wrapper { padding: 32px 24px; }
      .greeting { font-size: 15px; }
      .message { font-size: 13px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="wrapper">
      <div class="header">
        <div class="logo">Indev Digital</div>
      </div>
      
      <div class="content">
        <div class="greeting">Hello ${escapeHtml(message.clientName)},</div>
        
        <div class="message">Thank you for reaching out to us. We have received your message and will review it carefully. We will be in touch shortly with a response.</div>
        
        <div class="section">
          <div class="section-label">Reference Number</div>
          <div class="section-value"><span class="ref-code">${escapeHtml(messageRef)}</span></div>
        </div>
        
        <div class="section">
          <div class="section-label">Topic</div>
          <div class="section-value">${escapeHtml(message.topic)}</div>
        </div>
        
        <div class="section">
          <div class="section-label">Your Message</div>
          <div class="message-box">${escapeHtml(message.message).replace(/\n/g, "<br/>")}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <div class="footer-text">We will send our reply to <span class="highlight">${escapeHtml(message.clientEmail)}</span></div>
          <div class="footer-text" style="margin-top: 16px;">Thank you for your interest in Indev Digital.</div>
          <div class="footer-text" style="margin-top: 24px; border-top: 1px solid #e0e0e0; padding-top: 16px; font-size: 11px; color: #999999;">This is an automated message. Please do not reply to this email. If you have additional questions, please use the contact form on our website.</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = [
    `Hello ${message.clientName},`,
    "",
    "Thank you for reaching out to us. We have received your message and will review it carefully. We will be in touch shortly with a response.",
    "",
    `Reference Number: ${messageRef}`,
    `Topic: ${message.topic}`,
    `Your Message:`,
    `---`,
    message.message,
    `---`,
    "",
    `We will send our reply to ${message.clientEmail}`,
    "",
    "Thank you for your interest in Indev Digital.",
    "",
    "This is an automated message. Please do not reply to this email.",
  ].join("\n");

  await sendMail({
    to: message.clientEmail,
    subject,
    text: textContent,
    html: htmlContent,
  });

  return true;
}

async function sendMessageInboxEmail(message) {
  if (!isMailerConfigured()) {
    return false;
  }

  const subject = `New website message from ${message.clientName}`;
  const summary = buildSummary(message);

  await sendMail({
    to: INBOX_EMAIL,
    replyTo: message.clientEmail,
    subject,
    text: [
      "New message submitted from the website.",
      "",
      summary,
      "",
      `Reply-to: ${message.clientEmail}`,
    ].join("\n"),
    html: `
      <p>New message submitted from the website.</p>
      <p><strong>Message details</strong><br/>${escapeHtml(summary).replace(/\n/g, "<br/>")}</p>
      <p><strong>Reply-to:</strong> ${escapeHtml(message.clientEmail)}</p>
    `,
  });

  return true;
}

module.exports = {
  sendMessageReceivedEmail,
  sendMessageInboxEmail,
};