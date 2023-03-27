const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const contactsRouter = require("./src/routes/api/contacts");
const usersRouter = require("./src/routes/api/users");
const { errorHandler } = require("./src/helpers/errors");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const AVATAR_PATH = path.resolve("./public/avatars");

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/avatars", express.static(AVATAR_PATH));

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

module.exports = app;
