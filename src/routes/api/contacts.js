const express = require("express");

const {
  addPostValidation,
  addPutValidation,
  addPatchValidation,
  getAllPostsValidation,
} = require("../../middlewares/validation");

const {
  getAllContacts,
  getCurrentContactById,
  addNewContact,
  deleteContact,
  editContact,
  editContactStatus,
} = require("../../controllers/contactsController");

const asyncWrapper = require("../../helpers/asyncWrapper");

const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllPostsValidation, asyncWrapper(getAllContacts));

router.get("/:contactId", asyncWrapper(getCurrentContactById));

router.post("/", addPostValidation, asyncWrapper(addNewContact));

router.delete("/:contactId", asyncWrapper(deleteContact));

router.put("/:contactId", addPutValidation, asyncWrapper(editContact));

router.patch(
  "/:contactId/favorite",
  addPatchValidation,
  asyncWrapper(editContactStatus)
);

module.exports = router;
