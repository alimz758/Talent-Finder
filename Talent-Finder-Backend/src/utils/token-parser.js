const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const jwtAuth = authorization => {
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = jwtAuth;