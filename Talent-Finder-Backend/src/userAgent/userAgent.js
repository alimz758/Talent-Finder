import { Schema, model } from "mongoose";

const userAgentSchema = Schema({
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
const UserAgent = model("UserAgent", userAgentSchema);
export default { UserAgent };