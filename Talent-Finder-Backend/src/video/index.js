const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Media= require("./media").Media
require("dotenv").config();
const controller = require("./controller.js");
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");