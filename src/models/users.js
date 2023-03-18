const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../db/usersSchema");
const {
  ConflictFieldError,
  WrongParametersError,
  UnauthorizedError,
} = require("../helpers/errors");

const registerUser = async (body) => {
  const isUserExist = await User.findOne({ email: body.email });

  if (isUserExist) {
    throw new ConflictFieldError("Email in use");
  }

  const user = new User({ ...body });
  return await user.save();
};

const loginUser = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist || !(await isUserExist.isPasswordValid(password))) {
    throw new WrongParametersError(`Email or password is wrong`);
  }

  const payload = { id: isUserExist.id };
  const token = jwt.sign(payload, process.env.SECRET);

  await User.findOneAndUpdate({ email }, { $set: { token } });

  const updatedUser = await User.findOne({ email });

  return updatedUser;
};

const logOutUser = async (_id) => {
  const isUserExist = await User.findOne({ _id });

  if (!isUserExist) {
    throw new UnauthorizedError("Not authorized");
  }

  await User.findOneAndUpdate({ _id }, { $unset: { token: 1 } });
};

const getUserData = async (_id) => {
  const isUserExist = await User.findOne({ _id });

  if (!isUserExist) {
    throw new UnauthorizedError("Not authorized");
  }

  return isUserExist;
};

const changeUserSubscriptionStatus = async (_id, subscription) => {
  const isUserExist = await User.findOne({ _id });

  if (!isUserExist) {
    throw new UnauthorizedError("Not authorized");
  }

  await User.findOneAndUpdate({ _id }, { $set: { subscription } });

  const updatedUser = await User.findOne({ _id });
  return updatedUser;
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  getUserData,
  changeUserSubscriptionStatus,
};
