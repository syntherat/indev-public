const db = require("../config/db");

function formatBookingRef(id) {
  return id ? `BOOK-${String(id).slice(0, 8).toUpperCase()}` : null;
}

function mapRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    bookingRef: formatBookingRef(row.id),
    clientName: row.client_name,
    clientEmail: row.client_email,
    companyName: row.company_name,
    timezone: row.timezone,
    meetingDate: row.meeting_date,
    meetingTime: row.meeting_time,
    durationMinutes: Number(row.duration_minutes || 30),
    message: row.message || "",
    guestEmails: Array.isArray(row.guest_emails) ? row.guest_emails : [],
    status: row.status,
    meetingLink: row.meeting_link || null,
    approvedByAdminId: row.approved_by_admin_id || null,
    approvedAt: row.approved_at || null,
    rejectionReason: row.rejection_reason || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createMeetingRequest({
  clientName,
  clientEmail,
  companyName,
  timezone,
  meetingDate,
  meetingTime,
  durationMinutes,
  message,
  guestEmails,
}) {
  const result = await db.query(
    `
      INSERT INTO meeting_requests (
        client_name,
        client_email,
        company_name,
        timezone,
        meeting_date,
        meeting_time,
        duration_minutes,
        message,
        guest_emails,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::text[], 'pending', current_timestamp, current_timestamp)
      RETURNING *
    `,
    [
      clientName,
      clientEmail,
      companyName || null,
      timezone,
      meetingDate,
      meetingTime,
      durationMinutes || 30,
      message || null,
      Array.isArray(guestEmails) ? guestEmails : [],
    ]
  );

  return mapRow(result.rows[0]);
}

module.exports = {
  createMeetingRequest,
};
