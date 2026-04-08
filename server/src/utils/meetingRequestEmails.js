const { isMailerConfigured, sendMail } = require("./mailer");

const INBOX_EMAIL = "hello@indevdigital.com";

function buildMeetingSummary(meeting) {
  const guests = Array.isArray(meeting.guestEmails) && meeting.guestEmails.length
    ? meeting.guestEmails.join(", ")
    : "None";

  return [
      `Booking ID: ${meeting.bookingRef || (meeting.id ? `BOOK-${String(meeting.id).slice(0, 8).toUpperCase()}` : "")}`,
    `Date: ${meeting.meetingDate}`,
    `Time: ${meeting.meetingTime}`,
    `Timezone: ${meeting.timezone}`,
    `Duration: ${meeting.durationMinutes} minutes`,
    `Guests: ${guests}`,
  ].join("\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendBookingInboxEmail(meeting) {
  if (!isMailerConfigured()) {
    return false;
  }

  const summary = buildMeetingSummary(meeting);
  const subject = `New booking request received - ${meeting.bookingRef || (meeting.id ? `BOOK-${String(meeting.id).slice(0, 8).toUpperCase()}` : "")}`;
  const guestList = Array.isArray(meeting.guestEmails) && meeting.guestEmails.length
    ? meeting.guestEmails.join(", ")
    : "None";

  const text = [
    "New call booking request received.",
    "",
    `Booking ID: ${meeting.bookingRef || (meeting.id ? `BOOK-${String(meeting.id).slice(0, 8).toUpperCase()}` : "")}`,
    `Client name: ${meeting.clientName}`,
    `Client email: ${meeting.clientEmail}`,
    `Company / topic: ${meeting.companyName || "-"}`,
    `Date: ${meeting.meetingDate}`,
    `Time: ${meeting.meetingTime}`,
    `Timezone: ${meeting.timezone}`,
    `Duration: ${meeting.durationMinutes} minutes`,
    `Guests: ${guestList}`,
    `Notes: ${meeting.message || "-"}`,
    "",
    "Full summary:",
    summary,
  ].join("\n");

  const html = `
    <p><strong>New call booking request received.</strong></p>
    <p><strong>Booking ID:</strong> ${escapeHtml(meeting.bookingRef || (meeting.id ? `BOOK-${String(meeting.id).slice(0, 8).toUpperCase()}` : ""))}</p>
    <p><strong>Client name:</strong> ${escapeHtml(meeting.clientName)}</p>
    <p><strong>Client email:</strong> ${escapeHtml(meeting.clientEmail)}</p>
    <p><strong>Company / topic:</strong> ${escapeHtml(meeting.companyName || "-")}</p>
    <p><strong>Date:</strong> ${escapeHtml(meeting.meetingDate)}</p>
    <p><strong>Time:</strong> ${escapeHtml(meeting.meetingTime)}</p>
    <p><strong>Timezone:</strong> ${escapeHtml(meeting.timezone)}</p>
    <p><strong>Duration:</strong> ${escapeHtml(`${meeting.durationMinutes} minutes`)}</p>
    <p><strong>Guests:</strong> ${escapeHtml(guestList)}</p>
    <p><strong>Notes:</strong><br/>${escapeHtml(meeting.message || "-").replace(/\n/g, "<br/>")}</p>
    <p><strong>Full summary</strong><br/>${escapeHtml(summary).replace(/\n/g, "<br/>")}</p>
  `;

  await sendMail({
    to: INBOX_EMAIL,
    replyTo: meeting.clientEmail,
    subject,
    text,
    html,
  });

  return true;
}

async function sendBookingReceivedEmail(meeting) {
  if (!isMailerConfigured()) {
    return false;
  }

  const summary = buildMeetingSummary(meeting);
  const subject = "We received your call booking request";

  const text = [
    `Hi ${meeting.clientName},`,
    "",
    "We have received your call booking request.",
    "",
    "We will send confirmation about the call on your requested date and time within 24 hours.",
    "If we are not able to schedule the meeting at that time, we will suggest alternate timings based on both our and your availability.",
    "",
    "Your submitted details:",
    summary,
    "",
    "Thanks,",
    "Indev Digital",
  ].join("\n");

  const html = `
    <p>Hi ${meeting.clientName},</p>
    <p>We have received your call booking request.</p>
    <p>We will send confirmation about the call on your requested date and time within 24 hours.</p>
    <p>If we are not able to schedule the meeting at that time, we will suggest alternate timings based on both our and your availability.</p>
    <p><strong>Your submitted details</strong><br/>${summary.replace(/\n/g, "<br/>")}</p>
    <p>Thanks,<br/>Indev Digital</p>
  `;

  await sendMail({
    to: meeting.clientEmail,
    subject,
    text,
    html,
  });

  return true;
}

module.exports = {
  sendBookingReceivedEmail,
  sendBookingInboxEmail,
};
