const mongoose = require("mongoose");

const userAgencySchema = mongoose.Schema({
    name: String,
    personalEmail: String,
    username: { type: String, index: true },
    password: String,
    picType: { type: String, default: "png" },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    agencyName: String,
    location: String,
    businessEmail: String

})


const UserAgency = mongoose.model("UserAgency", userAgencySchema);

module.exports = { UserAgency };