
const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
  ownerName: String,  
  ownerEmail: String,
  ownerUsername: String,
  ownerAge: Number,
  date: Date,
  uploadedAt: Date,
  videoDetail: String,
});

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video: Video };