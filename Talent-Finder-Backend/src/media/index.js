const express = require("express");
const router = new express.Router();
const Media= require("./media")
const controller = require("./controller.js");
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");

//upload a photo/video to the user profolio
router.post("/users/media", checkAuth, controller.mediaUpload.single('media'),async(req,res)=>{
    //const media = await Media.create(mediaInfo)
    const media = new Media({
        location: req.body.location,
        media:req.file.buffer,
        owner: req.user._id
    })
    try{
        await media.save()
        res.status(201).send()
    }
    catch(e){
        res.status(500).send()
    }
})
//get all medias for the current user
router.get("/users/media/all",checkAuth,async(req,res)=>{
    try{
        //populate the media for the current user using the virtual path
        await req.user.populate('media').execPopulate()
        //TODO SENDING ONLY THE BUFFERS
        res.send(req.user.media)
    }
    catch(e){
        res.status(500).send()
    }
})
//get a specific media
router.get("/users/media/:id", checkAuth, async(req,res)=>{
    try{
        //get the media with its id and the owner
        const mediaInfo = await Media.findOne({_id:req.params.id , owner:req.user.id})
        if(!mediaInfo){
            //if media is not found send a 404
            res.status(404).send()
        }
        const mediaOwnerName = req.user.name
        res.send({mediaInfo, mediaOwnerName})
    }
    catch(e){
        res.status(500).send()
    }
})
//delete a specific media
router.delete("/users/media/:id", checkAuth, async(req,res)=>{
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