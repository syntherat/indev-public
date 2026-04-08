exports.up = (pgm) => {
  pgm.createTable(
    "meeting_requests",
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
      company_name: {
        type: "text",
      },
      timezone: {
        type: "text",
        notNull: true,
      },
      meeting_date: {
        type: "date",
        notNull: true,
      },
      meeting_time: {
        type: "text",
        notNull: true,
      },
      duration_minutes: {
        type: "integer",
        notNull: true,
        default: 30,
      },
      message: {
        type: "text",
      },
      status: {
        type: "text",
        notNull: true,
        default: "pending",
      },
      meeting_link: {
        type: "text",
      },
      approved_by_admin_id: {
        type: "uuid",
      },
      approved_at: {
        type: "timestamp",
      },
      rejection_reason: {
        type: "text",
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

  pgm.addConstraint("meeting_requests", "meeting_requests_status_allowed", {
    check: "status IN ('pending', 'approved', 'rejected')",
  });

  pgm.addConstraint("meeting_requests", "meeting_requests_duration_positive", {
    check: "duration_minutes > 0",
  });

  pgm.createIndex("meeting_requests", ["status", "created_at"], {
    ifNotExists: true,
  });
  pgm.createIndex("meeting_requests", ["client_email"], { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable("meeting_requests", { ifExists: true });
};
