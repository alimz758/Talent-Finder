const mongoose = require("mongoose");
const userPerformerSchema = mongoose.Schema({
    name:{type: String, required:true}, // on the UI could be like actual name or artistic name
    email: {type: String, required:true},
    //TODO: RESEARCH ON AGE TO BE REQUIRED AND/OR GREATER THAN 18
    age:  { type: Number,
        validate(value){
            if(value<18){
                throw new Error("The age must be greater than 18")
            }
        }
    }, //for now do +18
    aboutMe: {type: String},
    username: { type: String, index: true , required:true},
    password: {type:String, required:true},
    location: {type: String, default:""},
    //change this to upload resume
    resume: String,
    picType: { type: String, default: "png" },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    education: {type: String, default:""},
    genreToPlay: {type: String, default:""},
    pastExperience:{type: String, default:""},
    message: {type: String, default:""},
    followings: {type: String, default:""},
    followers:{type: String, default:""},
})
const UserPerformer = mongoose.model("UserPerformer", userPerformerSchema);
module.exports= {UserPerformer};