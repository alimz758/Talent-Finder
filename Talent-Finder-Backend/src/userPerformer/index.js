const express = require("express");
const router = new express.Router();
const UserPerformer = require("./userPerformer").UserPerformer;
//const multiparty = require("multiparty");
// const fileType = require("file-type");
// const fs = require("fs");
const sha256 = require("sha256");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const db = require("./controller.js");
// const uploadFile = require("../db/awsS3_controller.js").uploadFile;
// const deleteFile = require("../db/awsS3_controller.js").deleteFile;
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");
const tokenParser = require("../utils/token-parser.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ACCEPTED_EMAIL = process.env.ACCEPTED_EMAIL;
const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;

sgMail.setApiKey(SENDGRID_API_KEY);
//const token = jwt.sign(UNIQUE-IDENTIFIER, sihnature, expiresIn:'24')
//================= SIGN UP ==============
//public
router.post("/users/signup", async(req,res)=>{
    try{
        //const token = jwt.sign({ email }, JWT_EMAIL_KEY, { expiresIn: "24h" });
        //validate the form
        if( await db.isValidAccount(req.body.email, req.body.password)){
            //call signup controller to signup the user after doing the validations
            await db.signup(req.body)
            //get a token for verification email
            const token = await newUserPerformer.generateAuthToken()
            //const token = await newUserPerformer.generateAuthToken()
            //Construct the verification email
            //If in STAGING MODE:
            if(process.env.MODE==="STAGING"){
                //verification url
                // var verificationURL ="localhost:" + process.env.PORT + "/users/verify?token=" + token;
                var msg = {
                        to: req.body.email.trim(),
                        from: 'thealimz758@ucla.edu',
                        subject: 'Email Verification',
                        text: 'Verify Please',
                        html: '<strong>Verify your account</strong>' ,
                };
            }
            else{
                //

                console.log("In production mode sending the verification email")
            }
            //send the verfication email
            sgMail.send(msg).then(()=>{
                res.sendStatus(201)
            }).catch((e)=>{
                res.status(500).send({ error: e });
            })
        }  
    }
    //Couldn't signup
    catch(e){
        res.status(409).send({ error: e });
    }
})
//User Login - public
router.post("/users/login", async(req, res) => {
    if(req.body.password){
        //hash the password
        req.body.password= sha256(req.body.password)
    }
    console.log(req.body.password)
    db.login(req.body.email, req.body.password, async (error,user)=>{
        if(error){
            res.status(401).send(error)
        }
        else{
            //get a token
            const token =  await user.generateAuthToken()
            res.status(200).send({
                authToken: token
            });
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
        res.status(500).send()
    }
});

router.post("/users/logoutAll",checkAuth, async (req,res)=>{
    try{
        //set the token array to empty
        req.user.tokens = []
        await req.user.save()
        res.send("User Logged out.")
    }
    catch(e){
        res.status(500).send()
    }
});
//UPDATE USER
//for patch an exisiting user in tryblock make sure to apply the validation as follows:
//const user = await User.findbyIdAndUpdate(req.param.id, req.body, {new:true, runValidators: true})
//if(noUSER) => ERROR WITH 404

//first run the middleware, checkAuth, to authenticate
router.get("/users/my-info", checkAuth, async (req, res) => {
    //after authenticating
    res.send(req.user)
 });
//FIND BY ID
// app.get('/users/:id', (req,res)=>{
//     const _id = req.params.id

//     ActorUser.findById(_id).then((user)=>{
//         if(user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }).catch((e)=>{
//         res.status(500).send()
//     })
// })

//async functions return a promise , return type:  Promise {value-to-return}
//NEET TO MAKE YOUR APIs async- wait so the client can both result and error
//i.e: function() is an async funciton
//await makes sure they run sync
// function().then((result)=>{

// }).catch((e)=>{

// })
 module.exports= router;
