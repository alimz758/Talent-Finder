const express = require("express");
const router = new express.Router();
const Media= require("../media/media").Media
const mongoose = require("mongoose")
//const controller = require("./controller.js");
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");
const Comment = require("./comment").Comment
//Write a comment for a media:mediaID
router.post("/media/:id/comment", checkAuth,async(req,res)=>{
    const commentInfo = {
        content: req.body.content,
        commentAuthorName: req.user.name,
        commentAuthorId:req.user.id,
        commentOwner: req.params.id
    }
    try{
        const media =await Media.findById({_id:req.params.id})
        if(!media){
            return res.status(404).send("Error: No such a media to write a comment")
        }
        await Comment.create(commentInfo)
        res.status(201).send()
    }
    catch(e){
        console.log(e)
        res.status(500).send({error:e})
    }
})
//Edit a comment
router.patch("/media/:id/comment/:id", checkAuth,async(req,res)=>{
    try{
        //commentID:  req.params.id)
        const originalComment = await Comment.findById(req.params.id)
        //TODO 
        //need more testing
        if(originalComment.commentAuthorId.toString()!==req.user.id){
            return res.status(400).send({error: "Permission Denied! Only the author of this comment can edit it"})
        }
        originalComment.content=req.body.content
        originalComment.editedAt = new Date()
        await originalComment.save()
        res.status(200).send()
    }
    catch(e){
        //TODO 
        //error doesn't get sent back
        console.log(e)
        res.status(400).send({error:e})
    }
})
//TODO:
//Delete a comment
module.exports= router;