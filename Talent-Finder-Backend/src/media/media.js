const mongoose = require("mongoose");
const Comments = require("../comment/comment.js").Comment
const mediaSchema = mongoose.Schema({
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
    url: {type: String},//Public URL of the media
    description:String
})
//relation with Comment
mediaSchema.virtual('comments',{
    ref: 'Comment',
    localField:'_id', //here media _id
    foreignField:'commentOwner' //the field in Comment that is related to the Media Schema

})
//delete comments for a media when media is removed
mediaSchema.pre('remove',async function(next){
    const media =this
    await Comments.deleteMany({commentOwner:media._id})
    next()
})
const Media = mongoose.model("Media", mediaSchema);
module.exports= {Media};