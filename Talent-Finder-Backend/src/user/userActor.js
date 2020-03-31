import { Schema, model } from "mongoose"
import { isEmail } from "validator"
const userActorSchema = Schema({
    name:{type: String, required:true},
    email: {type: String, required:true,
        //validate the email
        validate(email){
            if(!isEmail(email)){
                throw new Error("Email is invalid")
            }
        }
    },
    age:  { type: Number, default: 0, required:true,
        validate(value){
            if(value<18){
                throw new Error("The age must be greater than 18")
            }
        }
    
    }, //for now do +18
    aboutMe: String,
    username: { type: String, index: true , required:true},
    password: {type:String, required:true},
    location: String,
    //change this to upload resume
    resume: String,
    picType: { type: String, default: "png" },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    education: String,
    genreToPlay: String,
    pastExperience:String,
    message: String,
    followings: Array,
    followers: Array,
})
const UserActor = model("UserActor", userActorSchema);
export default { UserActor };