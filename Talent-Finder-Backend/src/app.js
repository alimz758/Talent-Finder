//importing modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const userPerformerRouter = require("./userPerformer/index");
//Express config
 const app = express();
// app.use(
//     cors({
//         origin: [process.env.FRONT_END_URL],
//         methods: ["GET", "POST"],
//         credentials: true
//     })
// );
  
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
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


// const rideRouter = require("./ride/index");
// const notiRouter = require("./noti/index");
// const stripeRouter = require("./stripe/index");
// const reviewRouter = require("./review/index");
// const requestRouter = require("./request/index");
  
app.use(userPerformerRouter);
// app.use(rideRouter);
// app.use(notiRouter);
// app.use(stripeRouter);
// app.use(reviewRouter);
// app.use(requestRouter);
//

module.exports = app;