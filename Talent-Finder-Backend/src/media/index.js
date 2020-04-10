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
//upload a photo/video to the user profolio ; key=media
router.post("/media", checkAuth, controller.mediaUpload.single('media'),async(req,res)=>{
    //object
    //TODO: process.env.DOMAIN_NAME NOT WORKING
    var id= mongoose.Types.ObjectId()
    var subjectToSearch =req.body.subject.trim().replace(/\s+/g, '-').toLowerCase()
    const mediaInfo = {
        _id: id,
        owner: req.user.name,
        description: req.body.description,
        subject: req.body.subject,
        location: req.body.location,
        media:req.file.buffer,
        //url
        url: "localhost:"+ PORT + "/media/"+ id.toString()+"/"+ subjectToSearch,
        owner: req.user._id
    }
    try{
        await Media.create(mediaInfo)
        res.status(201).send()
    }
    catch(e){
        res.status(500).send()
    }
})
//get a specific media
router.get("/media/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const mediaInfo = await Media.findOne({_id:req.params.id , owner:req.user.id})
        if(!mediaInfo){
            //if media is not found send a 404
            res.status(404).send()
        }
        const mediaOwnerName = req.user.name
        //await req.user.populate('media').execPopulate()
        await mediaInfo.populate('comments').execPopulate()
        const comments= mediaInfo.comments
        res.send({mediaInfo, mediaOwnerName ,comments})
    }
    catch(e){
        res.status(500).send(e)
    }
})
//get all medias for the current user
//TODO: NOT WORKING!!!
router.get("/media/all",checkAuth,async(req,res)=>{
    console.log("wefw")
    try{
        console.log("here")
        //populate the media for the current user using the virtual path
        await req.user.populate('media').execPopulate()
        //TODO HOW SENDING ONLY THE BUFFERS and all to
        console.log(req.user.media)
        res.send(req.user.media)
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
        const media = await Media.findOneAndDelete({_id:req.params.id , owner:req.user.id})
        if(!media){
            //if media is not found send a 404
            res.status(404).send()
        }
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})
module.exports= router;