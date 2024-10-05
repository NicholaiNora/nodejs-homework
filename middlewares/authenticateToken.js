import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import "dotenv/config";
const { SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(res.status(401).json({ message: "Not authorized" }));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || user.token !== token || !user.token) {
     next(res.status(401).json({ message: "Not authorized" }));
    }

    req.user = user;
    next();
  } catch {
    next(res.status(401).json({ message: "Not authorized" }));
  }
};

export { authenticateToken };

// Create a middleware to validate the token and add it to all routes that need to be secured.

// Middleware takes the token from the Authorization headers, checks the token for validity
// Return Unauthorized Error on error
// If the validation was successful, get the user's id from the token. Find a user in the database by this id
// If the user exists and the token matches what is in the database, write his data to req.user and call the next() method
// If no user with that id exists or tokens don't match, return Unauthorized Error
// Middleware unauthorized error
// Status: 401 Unauthorized
// Content-Type: application/json
// ResponseBody: {
//   "message": "Not authorized"
// }