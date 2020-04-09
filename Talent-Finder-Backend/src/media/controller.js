const Media = require("./media").Media;
const mongoose = require("mongoose");
const multer = require("multer");

//middleware for uploading files
const mediaUpload =multer({
    //restrictions
    limits:{
        //10Mb Max Size is allowed
        fileSize: 10000000
    },
    //filter the extensions that are allowed
    //3 ways to use the call back
        //1. callbacl(throw new Error("File must be an image, jpg, png..."))
        //2. callback(undefined,true): things go well, nothing went wrong and files was accepeted
        //3. callback(undefined, true): nothing went wrong but didn't accept the file
    fileFilter(req,file,callback){
        //accept jpg,png, jpeg
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("File must be an image with '.jpg', '.png' or '.jpeg' extension"))
        }
        callback(undefined,true) 
    }
})
module.exports ={
    mediaUpload
}