const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userPerformerSchema = mongoose.Schema({
    name:{type: String, required:true}, // on the UI could be like actual name or artistic name
    email: {type: String, required:true, unique:true},
    //TODO: RESEARCH ON AGE TO BE REQUIRED AND/OR GREATER THAN 18
    age:  { type: Number,
        validate(value){
            if(value<18){
                throw new Error("The age must be greater than 18")
            }
        }
    }, //for now do +18
    aboutMe: {type: String},
    password: {type:String, required:true},
    location: {type: String, default:""},
    //change this to upload resume
    resume: String,
    profilePic: { type: Buffer},
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    education: {type: String, default:""},
    genreToPlay: {type: String, default:""},
    pastExperience:{type: String, default:""},
    message: {type: String, default:""},
    followings: {type: String, default:""},
    followers:{type: String, default:""},
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})
//user method to generate a token
userPerformerSchema.methods.generateAuthToken = async function (){
    const user = this
    //return a token for this user
    const token=jwt.sign({email:user.email}, process.env.JWT_SECRET_KEY, {expiresIn: "24hr"})
    //saving the tokens in the database
    user.tokens=user.tokens.concat({token})
    //save the token in the db
    await user.save()
    return token
}
//helper methods to remove the provate data: password and tokens array from
// the return object
//call to res.send() would call this method
userPerformerSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    //delete fields to not send back to the client
    delete userObject.password
    delete userObject.tokens
    delete userObject.profilePic
    return userObject
}
const UserPerformer = mongoose.model("UserPerformer", userPerformerSchema);
module.exports= {UserPerformer};