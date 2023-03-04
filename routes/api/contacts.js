const express = require("express");
const contactsFunctions = require("../../models/contacts");
const router = express.Router();
const validationSchemas = require("../../validation/schemas");

router.get("/", async (req, res) => {
  const contacts = await contactsFunctions.listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const contact = await contactsFunctions.getContactById(req.params.contactId);
  if (!contact) res.status(404).json({ message: "Not found" });
  res.status(200).json(contact);
});

router.post("/", async (req, res) => {
  const validation = validationSchemas.postSchema.validate({ ...req.body });
  if (validation.error)
    return res.status(400).json({ message: "missing required name field" });

  const createdContact = await contactsFunctions.addContact(req.body);

  createdContact
    ? res.status(201).json(createdContact)
    : res.status(400).json({
        message: "contact with that name is already present in your contacts",
      });
});

router.delete("/:contactId", async (req, res) => {
  const isContactRemoved = await contactsFunctions.removeContact(
    req.params.contactId
  );

  isContactRemoved
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res) => {
  const validation = validationSchemas.putSchema.validate({ ...req.body });

  if (validation.error)
    return res.status(400).json({ message: "missing fields" });

  const updatedContact = await contactsFunctions.updateContact(
    req.params.contactId,
    req.body
  );

  updatedContact
    ? res.status(200).json(updatedContact)
    : res.status(404).json({ message: "Not found" });
});

module.exports = router;
