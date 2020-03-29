//importing modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//Express config
const app = express();

//app.get() get url
// for the root 
// app.get('', (req,res)=>{
//     //sending response back to the requester
//     res.send("Hell!")
// })
// //for local use
// app.listen(8000,
//     console.log("Server is listening...")
// ) 

// const userRouter = require("./user/index");
// const rideRouter = require("./ride/index");
// const notiRouter = require("./noti/index");
// const stripeRouter = require("./stripe/index");
// const reviewRouter = require("./review/index");
// const requestRouter = require("./request/index");
  
// app.use(userRouter);
// app.use(rideRouter);
// app.use(notiRouter);
// app.use(stripeRouter);
// app.use(reviewRouter);
// app.use(requestRouter);
//

module.exports = app;