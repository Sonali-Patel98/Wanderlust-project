const express=require("express");
const router=express.Router();

//reuire model of listing
const Listing=require("../models/listening.js");

//require custom WrapAsync
// const WrapAsyncs=require("../utils/wrapAsync.js");

//require ExpressError
const ExpressError=require("../utils/ExpressError.js");

const wrapAsync = require('../utils/wrapAsync.js');

//require joi for validation for schema server side 
const{listingSchema,reviewSchema,}=require("../schema.js");

//for connecting login authorization
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");

//controllers of listing
const listingController=require("../controllers/listing.js");
const { resolveInclude } = require("ejs");
//for multer for file
const multer  = require('multer');
//for storage in cloud
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
        //index route
    .get(wrapAsync(listingController.index))
    //post new create
    .post(
        isLoggedIn,
        validatelisting,
        upload.single('listall[image][url]'),
        // WrapAsyncs(listingController.newPostCreate)
        wrapAsync(listingController.newPostCreate)
    );
    

//CRUD KA CREATE OPERATIONS
router.get("/new",isLoggedIn,listingController.renderNewForm);


//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));






router
    .route("/:id")   
    //CRUD KA READ(SHOW) OPERATIONS
    .get(wrapAsync(listingController.alllisting))
    //update route 
    .put(
        isLoggedIn,
        isOwner,
         upload.single('listall[image][url]'),
        validatelisting,
        wrapAsync(listingController.update))
    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));




module.exports=router;