const express = require("express");
const {
  registerNewUser,
  loginExistingUser,
  logOutExistingUser,
  getExistingUserData,
  changeSubscriptionStatus,
} = require("../../controllers/usersController");
const {
  authValidation,
  userPatchValidation,
} = require("../../middlewares/validation");
const asyncWrapper = require("../../helpers/asyncWrapper");
const authMiddleware = require("../../middlewares/auth");

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

router.get("/current", authMiddleware, asyncWrapper(getExistingUserData));

module.exports = router;
