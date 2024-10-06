import express from "express";
import { getCurrentUsers, loginUser, logoutUser, signupUser, updateAvatar, updateUserSubscription } from "../../controllers/usersControllers.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    try {
        const result = await signupUser(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const result = await loginUser(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
});

router.get("/logout", authenticateToken, async (req, res, next) => {
    try {
        const result = await logoutUser(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
});

router.get("/current", authenticateToken, async (req, res, next) => {
    try {
        const result = await getCurrentUsers(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
});

router.patch("/", authenticateToken, async (req, res, next) => {
    try {
        const result = await updateUserSubscription(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
})

router.patch("/avatars", authenticateToken, upload.single("avatar"), async (req, res, next) => {
    try {
        const result = await updateAvatar(req, res, next);
        return result;
    } catch (error) {
        next(error);
    }
})

export { router };