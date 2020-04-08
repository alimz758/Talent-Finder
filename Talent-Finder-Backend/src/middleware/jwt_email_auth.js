const jwt = require("jsonwebtoken");
const UserPerformer = require("../userPerformer/userPerformer").UserPerformer
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
//TO enable auth for routes needed
const jwtEmailAuth = async (req, res, next) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    //find a user with the id requested and a verified token
    const user = await UserPerformer.findOneAndUpdate({ email: decoded.email, 'tokens.token':token}, {verified:true})
    //if no such a user found
    if(!user){
      throw new Error
    }
    //the current token that is being used when login/signup
    req.token=token
    req.user = user;
    next();
  } 
  catch (error) {
    return res.status(401).json({
      message: "ERROR: Verification failed, the token is expired."
    });
  }
};
module.exports = jwtEmailAuth;