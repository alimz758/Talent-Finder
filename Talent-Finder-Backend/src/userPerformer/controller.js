const UserPerformer = require("./userPerformer").UserPerformer;
const mongoose = require("mongoose");
const isEmail = require("isemail");
const sha256 = require("sha256");
const multer = require("multer");
// Signup controller
const signup = async (userInfo) =>{
    return new Promise (async (resolve, reject) =>{
        //hash the password
        userInfo.password = sha256(userInfo.password)
        try{
            //create a new user in DB
            const newUserPerformer = await UserPerformer.create(userInfo)
            resolve(newUserPerformer)
        }
        catch (e){
            UserPerformer.deleteOne({ username: userInfo.email }, () => {
                reject(e);
            });
        }
    })
}
//Validating the user info before signup, update
const isValidAccount = (email, password)=>{
    return new Promise(async (resolve, reject)=>{
        //check the database and see there is a user with an exisiting email
        const user = await UserPerformer.findOne({email:email.trim()})
        //if found a user
        if(user){
            //TODO: CHECK FOR VERIFICATION: LIKE IF THERE IS AN USER THAT IS NOT VERIFIED YET
            return reject("A verified account already exists with this email!");
        }else{
            return resolve(true);
        }
    })
}
//login 
const login = (email, password, callback)=>{
    UserPerformer.findOne(
        {
            email: email,
            password: password
        },
        (err, result) => {
            if (err) {
              callback(err, null);
            } 
            else if (result === null) {
              callback({ error: "User with email and password not found" }, null);
            } 
            else if (result.verified === false) {
              callback({ message: "Email has not been verified yet" }, null);
            } 
            else {
              callback(null, result);
            }
          }
    )
}
//middleware for uploading files
const profilePicUpload =multer({
    //restrictions
    limits:{
        //2Mb Max Size is allowed
        fileSize: 2000000
    },
    //filter the extensions that are allowed
    //3 ways to use the call back
        //1. callbacl(throw new Error("File must be an image, jpg, png..."))
        //2. callback(undefined,true): things go well, nothing went wrong and files was accepeted
        //3. callback(undefined, true): nothing went wrong but didn't accept the file
    fileFilter(req,file,callback){
        //accept jpg,png, jpeg
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("File must be an image with '.jpg', '.png' or '.jpeg' extension"))
        }
        callback(undefined,true) 
    }
})
//middleware for resume upload
const resumeUpload =multer({
    //restrictions
    limits:{
        //5Mb Max Size is allowed
        fileSize: 5000000
    },
    //filter the extensions that are allowed
    //3 ways to use the call back
        //1. callbacl(throw new Error("File must be an image, jpg, png..."))
        //2. callback(undefined,true): things go well, nothing went wrong and files was accepeted
        //3. callback(undefined, true): nothing went wrong but didn't accept the file
    fileFilter(req,file,callback){
        //accept jpg,png, jpeg
        if(!file.originalname.endsWith(".pdf")){
            return callback(new Error("File must be a PDF file"))
        }
        callback(undefined,true) 
    }
})
module.exports ={
    signup,
    isValidAccount,
    login,
    profilePicUpload,
    resumeUpload
}