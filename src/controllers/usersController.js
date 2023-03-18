const {
  registerUser,
  loginUser,
  logOutUser,
  getUserData,
  changeUserSubscriptionStatus,
} = require("../models/users");

const registerNewUser = async (req, res, next) => {
  const { email, subscription } = await registerUser(req.body);
  res.status(201).json({ user: { email, subscription } });
};

const loginExistingUser = async (req, res, next) => {
  const { email, subscription, token } = await loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

const logOutExistingUser = async (req, res, next) => {
  const { _id } = req.user;

  await logOutUser(_id);

  res.status(204).json({ message: "No Content" });
};

const getExistingUserData = async (req, res, next) => {
  const { _id } = req.user;

  const { email, subscription } = await getUserData(_id);

  res.status(200).json({ email, subscription });
};

const changeSubscriptionStatus = async (req, res, next) => {
  const { email, subscription, token } = await changeUserSubscriptionStatus(
    req.user._id,
    req.body.subscription
  );

  res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

module.exports = {
  registerNewUser,
  loginExistingUser,
  logOutExistingUser,
  getExistingUserData,
  changeSubscriptionStatus,
};
