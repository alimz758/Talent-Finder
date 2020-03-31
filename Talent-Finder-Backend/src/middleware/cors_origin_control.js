//TODO: Add the actual URL for production
var whitelist = [ "localhost:8000/"];


var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

module.exports = corsOptions;