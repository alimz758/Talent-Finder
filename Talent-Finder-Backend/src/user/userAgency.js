import { Schema, model } from "mongoose";

const userAgencySchema = Schema({
    name: String,
    personalEmail: String,
    username: { type: String, index: true },
    password: String,
    picType: { type: String, default: "png" },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    agencyName: String,
    location: String,
    businessEmail: String,
    followings: Array,
    followers: Array,
})


const UserAgency = model("UserAgency", userAgencySchema);

export default { UserAgency };