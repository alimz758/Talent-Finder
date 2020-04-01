const express = require("express");
const router = new express.Router();

//const multiparty = require("multiparty");
// const fileType = require("file-type");
// const fs = require("fs");
// const sha256 = require("sha256");
// const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const db = require("./controller.js");
// const uploadFile = require("../db/awsS3_controller.js").uploadFile;
// const deleteFile = require("../db/awsS3_controller.js").deleteFile;
// const checkAuth = require("../middleware/jwt_authenticator.js");
const tokenParser = require("../utils/token-parser.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ACCEPTED_EMAIL = process.env.ACCEPTED_EMAIL;
const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;

sgMail.setApiKey(SENDGRID_API_KEY);

//================= SIGN UP ==============
router.post("/api/users/signup", async(req,res)=>{
    try{
        //validate the form
        if( await db.isValidAccount(req.body.email, req.body.password)){
            //call signup controller to signup the user after doing the validations
            db.signup(req.body)
            //Construct the verification email
            //If in STAGING MODE:
            if(process.env.MODE==="STAGING"){
                var msg = {
                        to: req.body.email.trim(),
                        from: 'thealimz758@ucla.edu',
                        subject: 'Email Verification',
                        text: 'Verify Please',
                        html: '<strong>Just for testing</strong>',
                };
            }
            else{
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
//User Login
router.post("/api/users/login", (req, res) => {
    console.log("user login")
    //create new user

    //trt save: await user.save() the send back res.status(201).send()
    //catch(e): res.status(400).send()
});
//UPDATE USER
//for patch an exisiting user in tryblock make sure to apply the validation as follows:
//const user = await User.findbyIdAndUpdate(req.param.id, req.body, {new:true, runValidators: true})
//if(noUSER) => ERROR WITH 404


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
