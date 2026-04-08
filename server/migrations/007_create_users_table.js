exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    provider: {
      type: "text",
      notNull: true,
    },
    provider_user_id: {
      type: "text",
      notNull: true,
    },
    email: {
      type: "text",
    },
    name: {
      type: "text",
    },
    avatar_url: {
      type: "text",
    },
    profile_url: {
      type: "text",
    },
    last_login_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("users", ["provider", "provider_user_id"], { unique: true });
}

exports.down = (pgm) => {
  pgm.dropTable("users");
};