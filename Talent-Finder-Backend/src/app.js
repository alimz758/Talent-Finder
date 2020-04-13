//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const userPerformerRouter = require("./userPerformer/index");
const media = require("./media/index");
const comment = require("./comment/index");
//Express config
const app = express();
//// ATTENTION ////
///this part of code should not be uncommented unless we need to be out of read////
//a middleware
///START//
// app.use((req,res,next)=>{
//     res.status(503).send("Our app is under maintanance, will be up soon!")
// })
///// End////
app.use(express.json()); 
app.use(userPerformerRouter);
app.use(media);
app.use(comment)

module.exports = app;