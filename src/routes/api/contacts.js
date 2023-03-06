const express = require("express");

const {
  addPostValidation,
  addPutValidation,
} = require("../../middlewares/validation");

const {
  getAllContacts,
  getCurrentContactById,
  addNewContact,
  deleteContact,
  editContact,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getCurrentContactById);

router.post("/", addPostValidation, addNewContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", addPutValidation, editContact);

module.exports = router;
