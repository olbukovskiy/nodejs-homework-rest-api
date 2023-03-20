const jwt = require("jsonwebtoken");
const User = require("../db/usersSchema");
require("dotenv").config();
const { UnauthorizedError } = require("../helpers/errors");

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizedError("Not authorized"));
  }

  const [, token] = req.headers.authorization.split(" ");

  if (!token) {
    next(new UnauthorizedError("Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: id, token: { $eq: token } });

    if (!user) {
      next(new UnauthorizedError("Not authorized"));
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new UnauthorizedError("Not authorized"));
  }
};

module.exports = auth;
