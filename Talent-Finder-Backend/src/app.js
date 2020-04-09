//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const userPerformerRouter = require("./userPerformer/index");
const media = require("./media/index");
//Express config
const app = express();
// app.use(
//     cors({
//         origin: [process.env.FRONT_END_URL],
//         methods: ["GET", "POST"],
//         credentials: true
//     })
// );


//// ATTENTION ////
///this part of code should not be uncommented unless we need to be out of read////
//a middleware
///START//
// app.use((req,res,next)=>{
//     res.status(503).send("Our app is under maintanance, will be up soon!")
// })
///// End////

//use middleware : new req -> middleware function->route handler

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.get() get url
// for the root 
// app.get('', (req,res)=>{
//     //sending response back to the requester
//     res.send("Hell!")
// })


  
app.use(userPerformerRouter);
app.use(media);

module.exports = app;