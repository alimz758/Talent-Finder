const mongoose = require("mongoose");
const Comments = require("../comment/comment.js").Comment
const mediaSchema = mongoose.Schema({
    media: Buffer,
    ownerName: String,
    awsURL:String, //to store in aws,
    mediaType:String,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserPerformer'
    },
    subject: String,
    awsFilePathMediaID:mongoose.Schema.Types.ObjectId,
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
    description:String,
    mediaBucketKey:String,
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
mediaSchema.methods.toJSON = function(){
    const media = this
    const mediaObject = media.toObject()
    //delete fields to not send back to the client
    delete mediaObject.awsFilePathMediaID
    delete mediaObject.mediaBucketKey
    delete mediaObject.url
    return mediaObject
}
const Media = mongoose.model("Media", mediaSchema);
module.exports= {Media};