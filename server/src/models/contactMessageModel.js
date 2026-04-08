const db = require("../config/db");

function formatMessageRef(id) {
  return id ? `MSG-${String(id).slice(0, 8).toUpperCase()}` : null;
}

function mapRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    messageRef: formatMessageRef(row.id),
    clientName: row.client_name,
    clientEmail: row.client_email,
    topic: row.topic,
    message: row.message || "",
    status: row.status,
    replySubject: row.reply_subject || "",
    replyBody: row.reply_body || "",
    repliedByAdminId: row.replied_by_admin_id || null,
    repliedAt: row.replied_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createContactMessage({ clientName, clientEmail, topic, message }) {
  const result = await db.query(
    `
      INSERT INTO contact_messages (
        client_name,
        client_email,
        topic,
        message,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, 'new', current_timestamp, current_timestamp)
      RETURNING *
    `,
    [clientName, clientEmail, topic, message]
  );

  return mapRow(result.rows[0]);
}

module.exports = {
  createContactMessage,
};