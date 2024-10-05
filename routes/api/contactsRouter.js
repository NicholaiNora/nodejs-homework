import express from "express";
// prettier-ignore
import { addContact, deleteContactById, getAllContacts, getContactById, updateContactById, updateStatusContact } from "../../controllers/contactsControllers.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

// GET http://localhost:3000/api/contacts/
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const result = await getAllContacts(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// GET http://localhost:3000/api/contacts/{id}
router.get("/:contactId", authenticateToken, async (req, res, next) => {
  try {
    const result = await getContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// POST http://localhost:3000/api/contacts/
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    // Preventing lack of necessary data
    const result = await addContact(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

// DELETE http://localhost:3000/api/contacts/{id}
router.delete("/:contactId", authenticateToken, async (req, res, next) => {
  try {
    const result = await deleteContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", authenticateToken, async (req, res, next) => {
  try {
    const result = await updateContactById(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", authenticateToken, async (req, res, next) => {
  try {
    const result = await updateStatusContact(req, res, next);

    return result;
  } catch (error) {
    next(error);
  }
});

export { router };
