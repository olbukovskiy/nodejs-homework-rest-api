const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");

const { WrongParametersError, NotFoundInfo } = require("../helpers/errors");
const checkFavoriteType = require("../helpers/checkType");

const getAllContacts = async (req, res) => {
  let { limit, page, favorite } = req.query;

  limit = !limit ? 20 : parseInt(limit);
  page = !page ? 1 : parseInt(page);

  const paginationParams = {
    skip: limit * page - limit,
    limit: limit,
  };

  const searchParams = {
    owner: req.user._id,
  };

  if (favorite) {
    searchParams.favorite = checkFavoriteType(favorite);
  }

  const contacts = await listContacts(paginationParams, searchParams);
  res.status(200).json(contacts);
};

const getCurrentContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user);

  if (!contact) {
    throw new NotFoundInfo("Not found");
  }

  res.status(200).json(contact);
};

const addNewContact = async (req, res) => {
  const { body, user } = req;
  const createdContact = await addContact(body, user);

  if (!createdContact) {
    throw new WrongParametersError(
      "contact with that name is already present in your contacts"
    );
  }

  res.status(201).json(createdContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const isContactRemoved = await removeContact(contactId, req.user);

  if (!isContactRemoved) {
    throw new NotFoundInfo("Not found");
  }

  res.status(200).json({ message: "contact deleted" });
};

const editContact = async (req, res) => {
  const {
    body,
    params: { contactId },
  } = req;
  const updatedContact = await updateContact(contactId, body, req.user);

  if (!updatedContact) {
    throw new NotFoundInfo("Not found");
  }

  res.status(200).json(updatedContact);
};

const editContactStatus = async (req, res) => {
  const {
    body,
    params: { contactId },
  } = req;
  const updatedContact = await updateStatusContact(contactId, body, req.user);

  if (!updatedContact) {
    throw new NotFoundInfo("Not found");
  }

  res.status(200).json(updatedContact);
};

module.exports = {
  getAllContacts,
  getCurrentContactById,
  addNewContact,
  deleteContact,
  editContact,
  editContactStatus,
};
