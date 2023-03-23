const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const { v4: uniqueName } = require("uuid");
require("dotenv").config();

const resizeAvatar = require("../helpers/resizeAvatar");

const TMP_PATH = path.resolve("./tmp");
const AVATARS_PATH = path.resolve("./public/avatars");

const User = require("../db/usersSchema");
const { ConflictFieldError, UnauthorizedError } = require("../helpers/errors");

const registerUser = async (body) => {
  const isUserExist = await User.findOne({ email: body.email });

  if (isUserExist) {
    throw new ConflictFieldError("Email in use");
  }

  const avatarURL = gravatar.url(body.email, { s: 250, protocol: "http" });
  const user = new User({ ...body, avatarURL });

  return await user.save();
};

const loginUser = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist || !(await isUserExist.isPasswordValid(password))) {
    throw new UnauthorizedError(`Email or password is wrong`);
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

const changeAvatar = async (fileData, _id) => {
  const avatarName = uniqueName();
  const avatarPath = path.join(TMP_PATH, fileData.originalname);
  const avatarsPath = path.join(AVATARS_PATH, `${avatarName}.jpg`);
  const avatarURL = `/avatars/${avatarName}.jpg`;

  await resizeAvatar(avatarPath);

  await fs.rename(avatarPath, avatarsPath);

  const isUserExist = await User.findOne({ _id });

  if (!isUserExist) {
    throw new UnauthorizedError("Not authorized");
  }

  await User.findOneAndUpdate({ _id }, { $set: { avatarURL } });

  const updatedUser = await User.findOne({ _id });
  return updatedUser;
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  getUserData,
  changeUserSubscriptionStatus,
  changeAvatar,
};
