import { Contact } from "../models/contactsModel.js";
// prettier-ignore
import { contactValidation, favoriteValidation } from "../validation/validation.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const queryFavorite = favorite === "true" ? { favorite: true } : favorite === "false" ? { favorite: false } : {};

  const result = await Contact.find(queryFavorite)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    res.status(404).json({ message: "ID Not Found" });
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: "missing required name field" });
  }
  const result = await Contact.create(req.body);

  res.status(201).json(result);
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    res.status(404).json({ message: "ID Not Found" });
  }

  res.json({
    message: "Contact deleted",
  });
};

const updateContactById = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: "missing required name field" });
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    res.status(404).json({ message: "ID Not Found" });
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { error } = favoriteValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: "missing field favorite" });
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    res.status(404).json({ message: "ID Not Found" });
  }

  res.json(result);
};

// prettier-ignore
export { getAllContacts, getContactById, addContact, deleteContactById, updateContactById, updateStatusContact};
