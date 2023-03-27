const jwt = require("jsonwebtoken");
const User = require("../db/usersSchema");
require("dotenv").config();
const { UnauthorizedError } = require("../helpers/errors");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new UnauthorizedError("Not authorized");
    }

    const [, token] = req.headers.authorization.split(" ");

    if (!token) {
      throw new UnauthorizedError("Not authorized");
    }

    const { id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: id, token: { $eq: token } });

    if (!user) {
      throw new UnauthorizedError("Not authorized");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message));
  }
};

module.exports = auth;
