require("../src/db/mongoose");
const app = require("./app");
const path = require("path");
const chalk = require("chalk");
// const checkS3Connection = require("./db/awsS3_controller.js").checkS3Connection;
const corsOriginContoller = require("./middleware/cors_origin_control.js");
//const checkTransfer = require("./stripe/tool/check-transfer.js").checkTransfer;
// require("dotenv").config({ override: true });

//Port config for local and production 
const port = process.env.PORT || 8000;
//console.log(process.env.PORT)
console.log(
  chalk.green("[INIT]: Service is in ") +
    chalk.yellow(process.env.MODE) +
    " MODE"
);

// ////////////////////////////////////////
// //TESTER
// ////////////////////////////////////////

// app.get("/test-connection", (req, res) => {
//   res.send({
//     status: "Connection Successful"
//   });
// });

////////////////////////////////////////
//ERROR STATUS
////////////////////////////////////////
//checkTransfer();

app.get("/*", (req, res) => {
    //req.query: the url that user asks for
  res.send("Hello")
});

//checkS3Connection();
app.listen(port, () => {
  console.log(
    chalk.green("[INIT]: ") + "Server Listening on Port " + chalk.yellow(port)
  );
});