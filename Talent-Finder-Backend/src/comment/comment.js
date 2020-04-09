const mongoose = require("mongoose")

const commentScheme = mongoose.Schema({
    //user with its _id is an owner
    content: String,
    commentAuthorName:String,
    commentAuthorId: {type:mongoose.Schema.Types.ObjectId},
    //imageID
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Media'
    },
    createdAt: { type: Date, default: new Date() },
    editedAt:{ type: Date}
})

const Comment = mongoose.model("Comment", commentScheme);
module.exports= {Comment};