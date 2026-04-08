exports.up = (pgm) => {
  pgm.addColumns(
    "meeting_requests",
    {
      guest_emails: {
        type: "text[]",
        notNull: true,
        default: pgm.func("ARRAY[]::text[]"),
      },
    },
    {
      ifNotExists: true,
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns("meeting_requests", ["guest_emails"], {
    ifExists: true,
  });
};
