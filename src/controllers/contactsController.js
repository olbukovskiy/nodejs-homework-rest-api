const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");

const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

const getCurrentContactById = async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) return res.status(404).json({ message: "Not found" });
  res.status(200).json(contact);
};

const addNewContact = async (req, res) => {
  const createdContact = await addContact(req.body);

  createdContact
    ? res.status(201).json(createdContact)
    : res.status(400).json({
        message: "contact with that name is already present in your contacts",
      });
};

const deleteContact = async (req, res) => {
  const isContactRemoved = await removeContact(req.params.contactId);

  isContactRemoved
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" });
};

const editContact = async (req, res) => {
  const updatedContact = await updateContact(req.params.contactId, req.body);

  updatedContact
    ? res.status(200).json(updatedContact)
    : res.status(404).json({ message: "Not found" });
};

const editContactStatus = async (req, res) => {
  const updatedContact = await updateStatusContact(
    req.params.contactId,
    req.body
  );

  updatedContact
    ? res.status(200).json(updatedContact)
    : res.status(404).json({ message: "Not found" });
};

module.exports = {
  getAllContacts,
  getCurrentContactById,
  addNewContact,
  deleteContact,
  editContact,
  editContactStatus,
};
