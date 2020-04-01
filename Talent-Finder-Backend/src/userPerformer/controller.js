const UserPerformer = require("./userPerformer").UserPerformer;
const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({});
const isEmail = require("isemail");
const sha256 = require("sha256");

// Signup controller
const signup = async (userInfo) =>{
    console.log("In signup controller", userInfo)
    return new Promise (async (resolve, reject) =>{
        //hash the password
        userInfo.password = sha256(userInfo.password)
        var username= userInfo.username
        var email = userInfo.email
        try{
            //create a new user in DB

            const newUserPerformer = await UserPerformer.create(userInfo)
            resolve(newUserPerformer)
        }
        catch (e){
            User.deleteOne({ username: userInfo.username }, () => {
                reject(e);
            });
        }
    })
}
//Validating the user info before signup, update
const isValidAccount = (email, password)=>{
    return new Promise(async (resolve, reject)=>{
        //check the database and see there is a user with an exisiting email
        const user = UserPerformer.findOne({email:email.trim()})
        //if found a user
        if(user){
            //TODO: CHECK FOR VERIFICATION: LIKE IF THERE IS AN USER THAT IS NOT VERIFIED YET
            return reject("A verified account already exists with this email!");
        }
    })
}



module.exports ={
    signup,
    isValidAccount
}