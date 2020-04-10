const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
    //user with its _id is an owner
    _id: mongoose.Schema.Types.ObjectId,
    media: Buffer,
    ownerName: String,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserPerformer'
    },
    subject: String,
    private: {type:Boolean,default:false},//only connection can see
    createdAt: { type: Date, default: new Date() },
    editedAt:{type:Date},
    numberOfLikes: {type:Number, default:0},
    likesStats:[{
        likerName:String,
        likerID: mongoose.Schema.Types.ObjectId,
        likerURL:String
    }],
    location: String,
    tags:Array,
    url: {type: String, required: true},
    description:String
})
//relation with Comment
mediaSchema.virtual('comments',{
    ref: 'Comment',
    localField:'_id', //here media _id
    foreignField:'commentOwner' //the field in Comment that is related to the Media Schema

})
const Media = mongoose.model("Media", mediaSchema);
module.exports= {Media};