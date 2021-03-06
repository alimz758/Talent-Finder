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
const VIDEO_BUCKET_NAME= process.env.AWS_VIDEO_BUCKET_NAME
const IMAGE_BUCKET_NAME=process.env.AWS_IMAGE_BUCKET_NAME;
const OPTIMIZED_BUCKET_NAME= process.env.AWS_OPTIMIZED_BUCKET_NAME
const AWS_REGION= process.env.AWS_REGION
const AWS_CLOUD_FRONT_DOMAIN_NAME= process.env.AWS_CLOUD_FRONT_DOMAIN_NAME
const multiparty = require("multiparty");
const fileType = require("file-type");
const fs = require("fs");
//AWS S3 storage
const uploadFile = require("../db/awsS3_controller.js").uploadFile;
const deleteFile = require("../db/awsS3_controller.js").deleteFile;
const getFile = require("../db/awsS3_controller.js").getFile;
//post media for aws:
router.post("/media", checkAuth,async(req,res)=>{
    const form = new multiparty.Form();
    //console.log(form)
    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.log(error)
            return res.status(400).send(error);
        }
        try {
            //NOTE: THE KEY FOR MEIDA POST REQUEST IS 'media'
            //console.log("file: ", files)
            const path = files.media[0].path;
            const buffer = fs.readFileSync(path);
            const type = await fileType.fromBuffer(buffer);//TYPE: { ext: 'mp4', mime: 'video/mp4' }
            const allowedFileType = ["jpg", "jpeg", "heic", "png","mp4","3GPP", "AVI", "FLV", "MOV", "MPEG4", "MPEGPS", "WebM", "WMV"];
            //check the file extension
            if (!type || !allowedFileType.includes(type.ext)) {
                return res.status(400).send({
                    message: "ERROR: file type must be of: for Images: jpg, jpeg, heic, png. For Videos: 3GPP, AVI, FLV, MOV, MPEG4, MPEGPS, WebM, WMV"
                });
            }
            const videotype = ["3GPP", "AVI", "FLV", "MOV", "MPEG4", "MPEGPS", "WebM", "WMV","mp4"]
            const email = req.user.email
            const mediaID = new mongoose.mongo.ObjectId();
            const fileName = `${email}/${mediaID}`;
            const userFolderPath = `${email}/`
            req.user.userFolderPathOnS3= userFolderPath
            await req.user.save()
            //upload on AWS S3
            var data;
            //Since there are two buckets for videos, 1 for storage the normal one and the second for an optimized version
            //and since they way I have formated the each Key name of the objects unique with an /email/objectID.extension
            //without reading the object from the optimized bucket, more time effeicient, i reformat the key of first object key
            //to ann optimzed object key after uploading the video and store those in db
            //you can see those steps here
            if(videotype.includes(type.ext)){
                data = await uploadFile(VIDEO_BUCKET_NAME,buffer, fileName, type)
                //temp string to to extract the key without its extentions for thubmnail key and url
                var tempStr=  controller.reverseString( controller.reverseString(data.Key).slice(4));
                //creating a cloudFrontURL to store in the db
                const substr="https://"+ VIDEO_BUCKET_NAME+".s3."+AWS_REGION+".amazonaws.com/"
                const len = substr.length
                var slicedURL= data.Location.slice(len)
                //cloudfront url
                var videoBucketKey= data.Key
                var videoCloudFrontURL= AWS_CLOUD_FRONT_DOMAIN_NAME+"optmized-video/"+slicedURL
                var optimizedVideoKey="optmized-video/"+data.Key
                var optimizedThumbKey="optmized-video/"+ tempStr+"-00001.png"
                var thumbnailURL= AWS_CLOUD_FRONT_DOMAIN_NAME+ "optmized-video/" + controller.reverseString( controller.reverseString(slicedURL).slice(4))+"-00001.png"
            }
            else{
                data = await uploadFile(IMAGE_BUCKET_NAME,buffer, fileName, type);
            }
            const mediaInfo = {
                ownerName: req.user.name,
                description: req.body.description,
                subject: req.body.subject,
                location: req.body.location,
                owner: req.user._id,
                awsFilePathMediaID:mediaID,
                url: videotype.includes(type.ext)? videoCloudFrontURL: data.Location,
                mediaType: type.ext,
                mediaBucketKey: videotype.includes(type.ext)? videoBucketKey:data.Key,
                optimizedVideoKey: optimizedVideoKey,
                optimizedThumbKey:optimizedThumbKey,
                thumbnailURL:videotype.includes(type.ext)? thumbnailURL: ""
            }
            const media = await Media.create(mediaInfo)
            res.status(201).send({media})
        }
        catch(e){
            console.log(e)
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
            return res.status(404).send()
        }
        //if the extention is for ann image then delte the image from the image bucket
        if(['png', 'jpg','jpeg'].includes(media.mediaType)){
            await deleteFile(IMAGE_BUCKET_NAME,media.mediaBucketKey);
        }
        //other wise remove the object from video bucket and the optimzed bucket and the thumbnail from the bucket
        else{
            await deleteFile(VIDEO_BUCKET_NAME,media.mediaBucketKey);
            await deleteFile(OPTIMIZED_BUCKET_NAME,media.optimizedVideoKey);
            await deleteFile(OPTIMIZED_BUCKET_NAME,media.optimizedThumbKey);
        }
        //Remove the meida object from S3, it'll remove all the comments assoiciated with this media
        await media.remove()
        res.send(media)
    }
    catch(e){
        console.log(e)
        res.status(500).send({error:e})
    }
})
module.exports= router;