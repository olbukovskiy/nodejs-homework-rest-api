const fsProvises = require("fs").promises;
const path = require("path");
const generateUniqueId = require("generate-unique-id");
require("colors");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const contactsBuffer = await fsProvises.readFile(contactsPath);
    const parsedContactsList = JSON.parse(contactsBuffer);

    return parsedContactsList;
  } catch (error) {
    return error.message;
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsBuffer = await fsProvises.readFile(contactsPath);
    const parsedContactsList = JSON.parse(contactsBuffer);

    const contactById = parsedContactsList.find(
      (contact) => contact.id === contactId.toString()
    );

    if (!contactById) return false;

    return contactById;
  } catch (error) {
    return error.message;
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsBuffer = await fsProvises.readFile(contactsPath);
    const parsedContactsList = JSON.parse(contactsBuffer);

    const contactById = parsedContactsList.find(
      (contact) => contact.id === contactId.toString()
    );

    if (!contactById) return false;

    const filteredContacts = parsedContactsList.filter((contact) => {
      return contact.id !== contactId.toString();
    });

    await fsProvises.writeFile(contactsPath, JSON.stringify(filteredContacts));

    return true;
  } catch (error) {
    return error.message;
  }
};

const addContact = async (body) => {
  try {
    const contactsBuffer = await fsProvises.readFile(contactsPath);
    const parsedContactsList = JSON.parse(contactsBuffer);

    const check = parsedContactsList.find(
      (contact) => contact.name === body.name
    );

    if (check) return false;

    const newContact = { id: generateUniqueId(), ...body };
    const newContactsList = [...parsedContactsList, newContact];

    await fsProvises.writeFile(contactsPath, JSON.stringify(newContactsList));

    return newContact;
  } catch (error) {
    return error.message;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactsBuffer = await fsProvises.readFile(contactsPath);
    const parsedContactsList = JSON.parse(contactsBuffer);

    const checkById = parsedContactsList.find(
      (contact) => contact.id === contactId.toString()
    );

    if (!checkById) return false;

    const updatedContact = { ...checkById, ...body };
    const updatedContactsList = parsedContactsList.map((contact) => {
      if (contact.id === contactId.toString()) {
        return updatedContact;
      }

      return contact;
    });

    await fsProvises.writeFile(
      contactsPath,
      JSON.stringify(updatedContactsList)
    );

    return updatedContact;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
