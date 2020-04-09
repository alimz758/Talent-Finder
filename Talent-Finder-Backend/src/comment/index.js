const express = require("express");
const router = new express.Router();
//const Media= require("./media").Media
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
        owner: req.params.id
    }
    try{
        await Comment.create(commentInfo)
        res.status(201).send()
    }
    catch(e){
        res.status(500).send()
    }
})
//Edit a comment
router.patch("/media/:id/comment/:id", checkAuth,async(req,res)=>{
    try{
        //commentID:  req.params.id
        //console.log(req.params.id)
        //console.log(req.user)
        const originalComment = await Comment.findById(req.params.id)
        //console.log(comment)
        //console.log(req)
        if(originalComment.commentAuthorId.toString()!==req.user.id){
            return res.status(400).send({error: "Permission Denied! Only the author of this comment can edit it"})
        }
        originalComment.content=req.body.content
        originalComment.editedAt = new Date()
        //console.log(originalComment)
        await originalComment.save()
        res.status(200).send()
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})
module.exports= router;