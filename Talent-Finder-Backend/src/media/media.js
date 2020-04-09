const mongoose = require("mongoose");

const Media  = mongoose.model('Media',{
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
    tags:Array
})

module.exports = Media