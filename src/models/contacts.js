const Contact = require("../db/contactsSchema");

const listContacts = async ({ skip, limit }, searchParams) => {
  return Contact.find(searchParams).skip(skip).limit(limit);
};

const getContactById = async (contactId, { _id }) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner: _id });
    return contact;
  } catch (error) {
    return false;
  }
};

const removeContact = async (contactId, { _id }) => {
  try {
    return Contact.findOneAndRemove({ _id: contactId, owner: _id });
  } catch (error) {
    return false;
  }
};

const addContact = async (body, user) => {
  const contacts = await Contact.find();

  if (contacts.find((contact) => contact.name === body.name)) return false;

  const contact = new Contact({ ...body, owner: user._id });
  return contact.save();
};

const updateContact = async (contactId, body, { _id }) => {
  try {
    await Contact.findByIdAndUpdate(
      { _id: contactId, owner: _id },
      { ...body }
    );
    const contact = await Contact.findOne({ _id: contactId });
    return contact;
  } catch (error) {
    return false;
  }
};

const updateStatusContact = async (contactId, body, { _id }) => {
  try {
    await Contact.findOneAndUpdate(
      { _id: contactId, owner: _id },
      { $set: { ...body } }
    );
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
