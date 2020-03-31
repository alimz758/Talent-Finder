const UserPerformer = require("./userPerformer").User;
const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({});
const isEmail = require("isemail");
const sha256 = require("sha256");


// Signup controller
const signup = async (userInfo) =>{
    console.log("In signup controller", userInfo)
}

//Validating the user info before signup, update
const isValidAccount = (email, password)=>{
    return true
}



module.exports ={
    signup,
    isValidAccount
}