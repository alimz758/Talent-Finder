const express = require("express");
const router = new express.Router();

const multiparty = require("multiparty");
const fileType = require("file-type");
const fs = require("fs");
const sha256 = require("sha256");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

//const db = require("./controller.js");
// const uploadFile = require("../db/awsS3_controller.js").uploadFile;
// const deleteFile = require("../db/awsS3_controller.js").deleteFile;
// const checkAuth = require("../middleware/jwt_authenticator.js");
const tokenParser = require("../utils/token-parser.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ACCEPTED_EMAIL = process.env.ACCEPTED_EMAIL;
const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;

sgMail.setApiKey(SENDGRID_API_KEY);

//User Login
router.post("/users/login", (req, res) => {
  if (req.body.password) {
    req.body.password = sha256(req.body.password);
  }
  db.login(req.body.email, req.body.password, (err, data) => {
    if (err) {
      res.status(401).send(err);
    } else {
      const token = jwt.sign({ username: data.username }, JWT_SECRET_KEY, {
        expiresIn: "24h"
      });
      res.status(200).send({
        authToken: token
      });
    }
  });
});