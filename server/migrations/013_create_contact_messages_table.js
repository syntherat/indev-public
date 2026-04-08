exports.up = (pgm) => {
  pgm.createTable(
    "contact_messages",
    {
      id: {
        type: "uuid",
        primaryKey: true,
        default: pgm.func("gen_random_uuid()"),
      },
      client_name: {
        type: "text",
        notNull: true,
      },
      client_email: {
        type: "text",
        notNull: true,
      },
      topic: {
        type: "text",
        notNull: true,
      },
      message: {
        type: "text",
        notNull: true,
      },
      status: {
        type: "text",
        notNull: true,
        default: "new",
      },
      reply_subject: {
        type: "text",
      },
      reply_body: {
        type: "text",
      },
      replied_by_admin_id: {
        type: "uuid",
      },
      replied_at: {
        type: "timestamp",
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
    },
    { ifNotExists: true }
  );

  pgm.addConstraint("contact_messages", "contact_messages_status_allowed", {
    check: "status IN ('new', 'read', 'replied', 'archived')",
  });

  pgm.createIndex("contact_messages", ["status", "created_at"], {
    ifNotExists: true,
  });
  pgm.createIndex("contact_messages", ["client_email"], { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable("contact_messages", { ifExists: true });
};