require("colors");

const Contact = require("../db/contactsSchema");

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId });
    return contact;
  } catch (error) {
    return false;
  }
};

const removeContact = async (contactId) => {
  try {
    return Contact.findByIdAndRemove({ _id: contactId });
  } catch (error) {
    return false;
  }
};

const addContact = async (body) => {
  const contacts = await Contact.find();

  if (contacts.find((contact) => contact.name === body.name)) return false;

  const contact = new Contact({ ...body });
  return contact.save();
};

const updateContact = async (contactId, body) => {
  try {
    await Contact.findByIdAndUpdate({ _id: contactId }, { ...body });
    const contact = await Contact.findOne({ _id: contactId });
    return contact;
  } catch (error) {
    return false;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    await Contact.findByIdAndUpdate({ _id: contactId }, { $set: { ...body } });
    const contact = await Contact.findOne({ _id: contactId });
    return contact;
  } catch (error) {
    return false;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
