import express from "express";
// prettier-ignore
import { listContacts, getContactById, removeContact, addContact, updateContact } from "../../models/contacts.js";
import { contactValidation } from "../../validation/validation.js";

const router = express.Router();

// GET http://localhost:3000/api/contacts/
router.get("/", async (_req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET http://localhost:3000/api/contacts/{id}
router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      res.status(404).json({ message: "ID Not Found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST http://localhost:3000/api/contacts/
router.post("/", async (req, res, next) => {
  try {
    // Preventing lack of necessary data
    const { error } = contactValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing required name field" });
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE http://localhost:3000/api/contacts/{id}
router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (!result) {
      res.status(404).json({ message: "ID Not Found" });
    }
    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    // Preventing lack of necessary data
    const { error } = contactValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing required name field" });
    }
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      res.status(404).json({ message: "ID Not Found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router };
