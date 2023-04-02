const express = require("express");
const {
  registerNewUser,
  loginExistingUser,
  logOutExistingUser,
  getExistingUserData,
  changeSubscriptionStatus,
  changeUserAvatar,
} = require("../../controllers/usersController");
const {
  authValidation,
  userPatchValidation,
} = require("../../middlewares/validation");
const asyncWrapper = require("../../helpers/asyncWrapper");
const authMiddleware = require("../../middlewares/auth");
const loadPictureMiddleware = require("../../middlewares/loadPicture");

const router = express.Router();

router.patch(
  "/",
  authMiddleware,
  userPatchValidation,
  asyncWrapper(changeSubscriptionStatus)
);

router.post("/register", authValidation, asyncWrapper(registerNewUser));

router.post("/login", authValidation, asyncWrapper(loginExistingUser));

router.post("/logout", authMiddleware, asyncWrapper(logOutExistingUser));

router.post("/current", authMiddleware, asyncWrapper(getExistingUserData));

router.patch(
  "/avatars",
  authMiddleware,
  loadPictureMiddleware.single("avatar"),
  asyncWrapper(changeUserAvatar)
);

module.exports = router;
