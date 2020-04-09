const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
    //user with its _id is an owner
    media: Buffer,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserPerformer'
    },
    type: {type: String},
    createdAt: { type: Date, default: new Date() },
    likes: Number,
    location: String,
    tags:Array,
    description:String
})
//relation with Comment
mediaSchema.virtual('comment',{
    ref: 'Comment',
    localField:'_id', //here user _id
    foreignField:'owner' //the field in Comment that is related to the Media Schema

})
const Media = mongoose.model("Media", mediaSchema);
module.exports= {Media};