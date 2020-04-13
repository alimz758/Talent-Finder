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
const getFile = require("../db/awsS3_controller.js").getFile;
//post media for aws:
router.post("/aws/media", checkAuth,async(req,res)=>{
    const form = new multiparty.Form();
    console.log(form)
    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.log(error)
            return res.status(400).send(error);
        }
        try {
            //NOTE: THE KEY FOR MEIDA POST REQUEST IS 'file'
            console.log("file: ", files)
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const originalFileName= files.file[0].originalFilename
            const type = await fileType.fromBuffer(buffer);
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
            const fileName = `mediaFolder/${email}/${mediaID}-media`;
            //upload on AWS S3
            const data = await uploadFile(buffer, fileName, type);
            console.log(data)
            const mediaInfo = {
                ownerName: req.user.name,
                description: req.body.description,
                subject: req.body.subject,
                location: req.body.location,
                owner: req.user._id,
                awsFilePathMediaID:mediaID,
                url: data.Location,
                mediaType: type.ext,
                mediaBucketKey: data.key
            }
            await Media.create(mediaInfo)
            res.status(201).send()
        }
        catch(e){
            return res.status(500);
        }
    });
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
//ONLY the mida itself not other json with it
router.get("/media/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const mediaInfo = await Media.findById({_id:req.params.id})
        if(!mediaInfo){
            //if media is not found send a 404
            return res.status(404).send()
        }
        //get the object from S3 Bucket
        const data = await getFile(mediaInfo.mediaBucketKey);
        res.set('Content-Type',data.ContentType)
        res.send(data.Body)
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//get a media INFO
router.get("/media-info/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const mediaInfo = await Media.findById({_id:req.params.id})
        if(!mediaInfo){
            //if media is not found send a 404
            return res.status(404).send()
        }
        await mediaInfo.populate('comments').execPopulate()
        const mediaOwnerName = req.user.name
        const comments= mediaInfo.comments
        res.send({mediaInfo, mediaOwnerName ,comments})
    }
    catch(e){
        console.log(e)
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