const express = require("express");
const contactsFunctions = require("../../models/contacts");
const router = express.Router();
const Joi = require("joi");

const postSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().required(),
});

const putSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string(),
}).min(1);

router.get("/", async (req, res, next) => {
  const contacts = await contactsFunctions.listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await contactsFunctions.getContactById(req.params.contactId);
  if (!contact) res.status(404).json({ message: "Not found" });
  res.status(200).json(contact);
});

router.post("/", async (req, res, next) => {
  const validation = postSchema.validate({ ...req.body });
  if (validation.error)
    res.status(400).json({ message: "missing required name field" });

  const createdContact = await contactsFunctions.addContact(req.body);

  res.status(201).json(createdContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const isContactRemoved = await contactsFunctions.removeContact(
    req.params.contactId
  );

  isContactRemoved
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const validation = putSchema.validate({ ...req.body });
  if (validation.error) res.status(400).json({ message: "missing fields" });

  const updatedContact = await contactsFunctions.updateContact(
    req.params.contactId,
    req.body
  );

  updatedContact
    ? res.status(200).json(updatedContact)
    : res.status(404).json({ message: "Not found" });
});

module.exports = router;
