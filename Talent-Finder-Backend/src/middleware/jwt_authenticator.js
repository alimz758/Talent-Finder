const jwt = require("jsonwebtoken");
const UserPerformer = require("../userPerformer/userPerformer").UserPerformer
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
//TO enable auth for routes needed
const jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    //find a user with the id requested and a verified token
    const user = await UserPerformer.findOne({ email: decoded.email, 'tokens.token':token})
    //if no such a user found
    if(!user){
      throw new Error
    }
    req.user = user;
    next();
  } 
  catch (error) {
    return res.status(401).json({
      message: "ERROR: Please authenticate"
    });
  }
};
module.exports = jwtAuth;