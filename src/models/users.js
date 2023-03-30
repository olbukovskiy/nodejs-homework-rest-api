const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const { v4: createToken } = require("uuid");
const sgMail = require("@sendgrid/mail");
const fs = require("fs").promises;
require("dotenv").config();

sgMail.setApiKey(process.env.API_KEY);

const resizeAvatar = require("../helpers/resizeAvatar");

const AVATARS_PATH = path.resolve("./public/avatars");

const User = require("../db/usersSchema");
const {
  ConflictFieldError,
  UnauthorizedError,
  NotFoundInfo,
  WrongParametersError,
} = require("../helpers/errors");
const sendVerificationLink = require("../helpers/generateAndSendToken");

const registerUser = async (body) => {
  const isUserExist = await User.findOne({ email: body.email });

  if (isUserExist) {
    throw new ConflictFieldError("Email in use");
  }
  const verificationToken = createToken();
  const avatarURL = gravatar.url(body.email, { s: 250, protocol: "http" });
  const user = new User({ ...body, avatarURL, verificationToken });

  await sendVerificationLink(body.email, verificationToken);

  return await user.save();
};

const loginUser = async (email, password) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist || !(await isUserExist.isPasswordValid(password))) {
    throw new UnauthorizedError(`Email or password is wrong`);
  }

  const isUserVerified = await User.findOne({ email, verify: true });

  if (!isUserVerified) {
    throw new WrongParametersError("User still not verified");
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
  const { originalname, path: temporaryName } = fileData;
  const avatarName = `${_id}_${originalname}`;
  const avatarPath = path.join(AVATARS_PATH, avatarName);
  const avatarURL = `/avatars/${avatarName}`;

  await resizeAvatar(temporaryName);

  await fs.rename(temporaryName, avatarPath);

  const isUserExist = await User.findOne({ _id });

  if (!isUserExist) {
    throw new UnauthorizedError("Not authorized");
  }

  await User.findOneAndUpdate({ _id }, { $set: { avatarURL } });

  const updatedUser = await User.findOne({ _id });
  return updatedUser;
};

const verifyUser = async (verificationToken) => {
  const isUserExists = await User.findOne({ verificationToken });

  if (!isUserExists) {
    throw new NotFoundInfo("User not found");
  }

  const { email } = await User.findOneAndUpdate(
    { verificationToken },
    { $set: { verificationToken: null, verify: true } }
  );

  const updatedUser = await User.findOne({ email });

  return updatedUser;
};

const reVerification = async (email) => {
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new NotFoundInfo("User not found");
  }

  const isUserVerified = await User.findOne({ email, verify: false });

  if (!isUserVerified) {
    throw new WrongParametersError("Verification has already been passed");
  }

  const { verificationToken } = isUserVerified;

  await sendVerificationLink(email, verificationToken);

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  getUserData,
  changeUserSubscriptionStatus,
  changeAvatar,
  verifyUser,
  reVerification,
};
