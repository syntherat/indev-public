const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const env = require("./config/env");
const { pool } = require("./config/db");
const passport = require("./auth/passport");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const accountRoutes = require("./routes/accountRoutes");
const meetingRequestRoutes = require("./routes/meetingRequestRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: [env.clientOrigin, "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: "indev.sid",
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.nodeEnv === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/account", accountRoutes);
app.use("/api", meetingRequestRoutes);
app.use("/api", contactMessageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
