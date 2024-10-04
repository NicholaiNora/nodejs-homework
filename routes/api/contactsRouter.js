import express from "express";
// prettier-ignore
import { addContact, deleteContactById, getAllContacts, getContactById, updateContactById, updateStatusContact } from "../../controllers/contactsControllers.js";

const router = express.Router();

// GET http://localhost:3000/api/contacts/
router.get("/", async (req, res, next) => {
  try {
    const result = await getAllContacts(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// GET http://localhost:3000/api/contacts/{id}
router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await getContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// POST http://localhost:3000/api/contacts/
router.post("/", async (req, res, next) => {
  try {
    // Preventing lack of necessary data
    const result = await addContact(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// DELETE http://localhost:3000/api/contacts/{id}
router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await deleteContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const result = await updateContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const result = await updateStatusContact(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

export { router };
