import { Schema, model } from "mongoose"

const agencySchema = Schema ({
    agencyName: {type:String, required: true},
    //The URL would look like something like this: actfinder.com/agency/WHATEVER-THEY-NAME
    actFinderPublicURL: {type: String, required:true}, //within the platform
    websiteURL: String,
    //Agency Detail
    industry: String, //for now only acting
    //TODO: MAKE SURE THIS IS A THING FOR AGENCIES
    agencySize: Number, // kinda drop down for how many employees: ,
    logo: { type: String, default: "png" },
    tagline: String, //what does the agency do,
    followers: Number,
    location: String,
    employees: Array,// Not sure about this: Shows the agents, directors,etc that are affiliated with the agency
    aboutAgency: String,
    //TODO:
    //Like LinkedIn: on the UI THERE SHOULD BE A CHECK BOX FOR AGREEING THE FOLLOWING TERM:
    //I verify that I am an authorized representative of this organization and have the right to act on 
    //its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.
})
const Agency = model("Agency", agencySchema);
export default { Agency };