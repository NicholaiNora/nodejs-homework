import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Jimp } from "jimp";
import fs from "fs/promises";
import "dotenv/config";
import path from "path";
import { User } from "../models/usersModel.js";
// prettier-ignore
import { signupValidation, subscriptionValidation } from "../validation/validation.js";
import gravatar from "gravatar";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = signupValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a link to the user's avatar with gravatar
  const avatarURL = gravatar.url(email, { protocol: "http" });

  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      newUser: newUser.avatarURL,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = signupValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(409).json({ message: "Email or password is wrong" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(409).json({ message: "Email or password is wrong" });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;

  // Logout unauthorized error (setting token to empty string will remove token -> will logout)
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

const getCurrentUsers = async (req, res) => {
  const { email, subscription } = req.user; //validated user

  res.json({
    email,
    subscription,
  });
};

const updateUserSubscription = async (req, res) => {
  const { error } = subscriptionValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }

  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.json({
    id: req.body,
    email: req.user.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  await Jimp.read(oldPath)
  .then((image) => {
    console.log("Resizing image"); // Debug log
    image.cover({ w: 250, h: 250 }).write(oldPath);
    console.log("Image resized and saved to:", oldPath); // Debug log
  })
  .catch((error) => console.log(error));

  const newPath = path.join("public", "avatars", filename);
  console.log(newPath);
  await fs.rename(oldPath, newPath);

  let avatarURL = path.join("/avatars", filename);
  console.log(avatarURL);
  avatarURL = avatarURL.replace(/\\/g, "/");

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateUserSubscription,
  updateAvatar,
};
