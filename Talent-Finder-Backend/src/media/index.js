const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const Media= require("./media").Media
require("dotenv").config();
const controller = require("./controller.js");
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");
const DOMAIN_NAME = process.env.DOMAIN_NAME
const PORT = process.env.PORT
const multiparty = require("multiparty");
const fileType = require("file-type");
const fs = require("fs");
//AWS S3 storage
const uploadFile = require("../db/awsS3_controller.js").uploadFile;
const deleteFile = require("../db/awsS3_controller.js").deleteFile;
//post media for aws:
router.post("/aws/media", checkAuth,async(req,res)=>{
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(400).send(error);
        }
        try {
            console.log("file: ", file)
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const videoFileType= ["3GPP", "AVI", "FLV", "MOV", "MPEG4", "MPEGPS", "WebM", "WMV"]
            const allowedFileType = ["jpg", "jpeg", "heic", "png"];
            //check the file extension
            if (!type || !allowedFileType.includes(type.ext)) {
                return res.status(400).send({
                    message: "ERROR: file type must be of: jpg, jpeg, heic, or png"
                });
            }

            const email = req.user.email
            const mediaID = new mongoose.mongo.ObjectId();
            const fileName = `bucketFolder/${email}/${mediaID}-media`;
            //upload on AWS S3
            const data = await uploadFile(buffer, fileName, type);
            console.log("aws data: ", data)
            console.log("media url", data.location)
            console.log("file type,", type.ext)
            const mediaInfo = {
                ownerName: req.user.name,
                description: req.body.description,
                subject: req.body.subject,
                location: req.body.location,
                owner: req.user._id,
                awsFilePathMediaID:mediaID,
                url: data.location,
                mediaType: type.ext
            }
            await Media.create(mediaInfo)
            res.status(201).send()
        }
        catch(e){
            return res.status(500);
        }
    });
})
//upload a photo/video to the user profolio ; key=media
router.post("/media", checkAuth, controller.mediaUpload.single('media'),async(req,res)=>{
    //object
    //TODO: process.env.DOMAIN_NAME NOT WORKING
    // var id= mongoose.Types.ObjectId()
    // var subjectToSearch =req.body.subject.trim().replace(/\s+/g, '-').toLowerCase()
    const mediaInfo = {
        ownerName: req.user.name,
        description: req.body.description,
        subject: req.body.subject,
        location: req.body.location,
        media:req.file.buffer,
        //url
        //url: "localhost:"+ PORT + "/media/"+ id.toString()+"/"+ subjectToSearch,
        owner: req.user._id
    }
    try{
        await Media.create(mediaInfo)
        res.status(201).send()
    }
    catch(e){
        res.status(500).send({error:e})
    }
})

//Add a like a to the media
//send back the number of likes an array of Users' ObjectIDs who liked the Media
router.post("/media/:id/likes",checkAuth,async(req,res)=>{
    try{
        const media = await Media.findById({_id:req.params.id})
        if(!media){
            return res.status(404).send("Error: No such a media to like")
        }
        //like should be a number from the client either +1: liking, -1: undo the liking(only if previously liked)
        media.numberOfLikes+=parseInt(req.body.like)
        media.likesStats.push({likerName:req.user.name,likerID:req.user.id})
        await media.save()
        const numberOfLikes=   media.numberOfLikes
        const currentLikesStats = media.likesStats
        res.send({numberOfLikes, currentLikesStats})
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//get a specific media
router.get("/media/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const mediaInfo = await Media.findById({_id:req.params.id})
        if(!mediaInfo){
            //if media is not found send a 404
            return res.status(404).send()
        }
        const mediaOwnerName = req.user.name
        //await req.user.populate('media').execPopulate()
        await mediaInfo.populate('comments').execPopulate()
        const comments= mediaInfo.comments
        res.send({mediaInfo, mediaOwnerName ,comments})
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//delete a specific media
router.delete("/media/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const media = await Media.findById({_id:req.params.id , owner:req.user.id})
        if(!media){
            //if media is not found send a 404
            res.status(404).send()
        }
        //Remove the meida, it'll remove all the comments assoiciated with this media
        await media.remove()
        res.send(media)
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
module.exports= router;