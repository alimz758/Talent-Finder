const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");

//const Ride = require("./ride");
//const db = require("./controller.js");
const checkAuth = require("../middleware/jwt_authenticator.js");
const tokenParser = require("../utils/token-parser.js");

//Get List of Available/ future Rides
// router.get("/rides/matching-rides", (req, res) => {
//   db.getMatchingRides(req.query.filter, req.query.pageNum, (err, data) => {
//     if (err) {
//       res.sendStatus(500);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });