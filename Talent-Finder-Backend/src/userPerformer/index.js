const express = require("express");
const router = new express.Router();
const sha256 = require("sha256");
const sgMail = require("@sendgrid/mail");
const sharp =require("sharp")
const db = require("./controller.js");
const UserPerformer = require("./userPerformer").UserPerformer
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");
const checkEmailAuth = require("../middleware/jwt_email_auth.js");
//KEY
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;


sgMail.setApiKey(SENDGRID_API_KEY);
//first run the middleware, checkAuth, to authenticate
router.get("/users/my-info", checkAuth, async (req, res) => {
    //after authenticatin 
    //send the user info
    res.send(req.user)
 });
//Create/Update user info fields
router.post("/users/my-info", checkAuth, async(req,res)=>{
    try{
        const user =req.user
        user.gender = req.user.gender
        user.name= req.body.name
        user.bio= req.body.bio
        user.location= req.body.location
        user.education= req.body.education
        await user.save()
        res.send()
    }
    catch(e){
        res.status(409).send({ error: e });
    }
})
//================= SIGN UP ==============
//public
router.post("/users/signup", async(req,res)=>{
    try{
        //const token = jwt.sign({ email }, JWT_EMAIL_KEY, { expiresIn: "24h" });
        //validate the form
    
        if( await db.isValidAccount(req.body.email, req.body.password)){
            //call signup controller to signup the user after doing the validations
            const user = await db.signup(req.body)
            //get a token for verification email
            const token = await user.generateAuthToken()
            //Construct the verification email
            //If in STAGING MODE:
            // if(process.env.MODE==="STAGING"){
            //     //verification url
            //     var verificationURL ="localhost:" + process.env.PORT + "/users/verify?token=" + token;
            //     var msg = {
            //             to: req.body.email.trim(),
            //             from: 'thealimz758@ucla.edu',
            //             subject: 'Email Verification',
            //             text: 'Verify Please',
            //             html: '<strong>Verify your account</strong> '+ verificationURL ,
            //     };
            // }
            // else{
            //     //
            //     console.log("In production mode sending the verification email")
            // }
            //send the verfication email
            // sgMail.send(msg).then(()=>{
            //     res.sendStatus(201)
            // }).catch((e)=>{
            //     res.status(500).send({ error: e });
            // })
            res.status(201).send({user, token}) 
        } 
       
    }
    //Couldn't signup
    catch(e){
        console.log(e)
        res.status(409).send({ error: e });
    }
})
//User Login - public
router.post("/users/login", async(req, res) => {
    if(req.body.password){
        //hash the password
        req.body.password= sha256(req.body.password)
    }
    db.login(req.body.email, req.body.password, async (error,user)=>{
        if(error){
            res.status(401).send(error)
        }
        else{
            //get a token
            const token =  await user.generateAuthToken()
            //send the 
            res.send({  user,token})
        }
     })
});
//user logout
router.post("/users/logout",checkAuth, async (req,res)=>{
    try{
        //modify the tokens array to remove token being used
        req.user.tokens =req.user.tokens.filter((token)=>{
            //filter tokens, keep the ones that are not the same as req.token
            return token.token !== req.token
        })
        await req.user.save()
        res.send("User Logged out.")
    }
    catch(e){
        res.status(500).send({error:e})
    }
});
//remove all the sessions open and log all out
router.post("/users/logoutAll",checkAuth, async (req,res)=>{
    try{
        //set the token array to empty
        req.user.tokens = []
        await req.user.save()
        res.status(200).send("All sessions are removed")
    }
    catch(e){
        res.status(500).send({error:e})
    }
});
//TODO

//verify email after signup
router.get("/users/verify", checkEmailAuth, (req,res)=>{
    //NOTE THIS IS FOR DEV MODE
    //FOR PRODUCTION MODE GOTTA MAKE REDIRECT 
    const user= req.user
    const token = req.token
    res.send({user,token})
        //TODO
        //redirect to login page
})
//////PROFILE PICTURE
//Create & update profile pic
router.post("/users/me/profile-pic", checkAuth,db.profilePicUpload.single('profile-pic'),async(req,res)=>{
    //get access to the binary file of the image and store in db
    //format the image to 
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.profilePic=buffer
    await req.user.save()
    //200
    res.send()
}, 
//call back to handle errors to send back to the client
(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
router.get("/users/me/profile-pic", checkAuth, async(req,res)=>{
    try{
        const user= req.user
        if(!user.profilePic){
            throw new Error("There is no profile pic")
        }
        //set the content-type
        res.set('Content-Type','image/png')
        res.send(user.profilePic)
    }
    catch (e){
        res.status(404).send({error:e})
    }
})
//delete profile pic
router.delete("/users/me/profile-pic", checkAuth, async(req,res)=>{
    try{
        req.user.profilePic= undefined
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//END OF PROFILE PIC
//Create and/or update the resume
router.post("/users/me/resume", checkAuth,db.resumeUpload.single('resume'),async(req,res)=>{
    //get access to the binary file of the PDF file and store in db
    req.user.resume=req.file.buffer
    await req.user.save()
    //200
    res.send()
}, 
//call back to handle errors to send back to the client
(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
//get the resume
router.get("/users/me/resume", checkAuth, async(req,res)=>{
    try{
        const user= req.user
        if(!user.resume){
            throw new Error("There is no resume")
        }
        //set the content-type
        res.set('Content-Type','application/pdf')
        res.send(user.resume)
    }
    catch (e){
        res.status(404).send({error:e})
    }
})
//delete resume
router.delete("/users/me/resume", checkAuth, async(req,res)=>{
    try{
        req.user.resume= undefined
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//Delete user
router.delete("/users/me",checkAuth, async(req,res)=>{
    try{
        //using mongoose remove() method to delete the user from DB
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//TODO
//GET USER BY ID
router.get("/users/:id",checkAuth, async(req,res)=>{
    try{
        //using mongoose remove() method to delete the user from DB
        const user = await UserPerformer.findById({_id:req.params.id})
        if(!user){
            return res.status(404).send()
        }
        res.send({userInfo:user})
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
//get user's all media
//TODO: SNEDING BACK SORTED BASED ON CREATEDAT DATE
router.get("/users/:id/media",checkAuth, async(req,res)=>{
    try{
        const user = await UserPerformer.findById({_id:req.params.id})
        if(!user){
            return res.status(404).send()
        }
        await req.user.populate('media').execPopulate()
        res.send({media: req.user.media})
    }
    catch(e){
        res.status(500).send({error:e})
    }
})
 module.exports= router;
