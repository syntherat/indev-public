const db = require("../config/db");

function mapUserRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    provider: row.provider,
    providerUserId: row.provider_user_id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    profileUrl: row.profile_url,
    contactNumber: row.contact_number,
    country: row.country,
    postalCode: row.postal_code,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findById(id) {
  const result = await db.query(
    `
      SELECT
        id,
        provider,
        provider_user_id,
        email,
        name,
        avatar_url,
        profile_url,
        contact_number,
        country,
        postal_code,
        last_login_at,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return mapUserRow(result.rows[0]);
}

async function findByProvider(provider, providerUserId) {
  const result = await db.query(
    `
      SELECT
        id,
        provider,
        provider_user_id,
        email,
        name,
        avatar_url,
        profile_url,
        contact_number,
        country,
        postal_code,
        last_login_at,
        created_at,
        updated_at
      FROM users
      WHERE provider = $1 AND provider_user_id = $2
      LIMIT 1
    `,
    [provider, providerUserId]
  );

  return mapUserRow(result.rows[0]);
}

async function upsertOAuthUser({ provider, providerUserId, email, name, avatarUrl, profileUrl }) {
  const result = await db.query(
    `
      INSERT INTO users (
        provider,
        provider_user_id,
        email,
        name,
        avatar_url,
        profile_url,
        last_login_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp)
      ON CONFLICT (provider, provider_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        profile_url = EXCLUDED.profile_url,
        last_login_at = current_timestamp,
        updated_at = current_timestamp
      RETURNING
        id,
        provider,
        provider_user_id,
        email,
        name,
        avatar_url,
        profile_url,
        contact_number,
        country,
        postal_code,
        last_login_at,
        created_at,
        updated_at
    `,
    [provider, providerUserId, email || null, name || null, avatarUrl || null, profileUrl || null]
  );

  return mapUserRow(result.rows[0]);
}

module.exports = {
  findById,
  findByProvider,
  upsertOAuthUser,
};