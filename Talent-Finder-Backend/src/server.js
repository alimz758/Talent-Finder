require("../src/db/mongoose");
const app = require("./app");
const chalk = require("chalk");
const checkS3Connection = require("./db/awsS3_controller.js").checkS3Connection;
require("dotenv").config({ override: true });
//Port config for local and production 
const port = process.env.PORT || 3000 ;
//console.log(process.env.PORT)
console.log(
  chalk.green("[INIT]:") + " Service is in " +
    chalk.yellow(process.env.MODE) +
    " MODE"
);
//check the connection to S3 Bucket
checkS3Connection()
app.get("/*", (req, res) => {
    //req.query: the url that user asks for
  res.send("Hello")
});
app.listen(port, () => {
  console.log(
    chalk.green("[INIT]: ") + "Server Listening on PORT " + chalk.yellow(port)
  );
});