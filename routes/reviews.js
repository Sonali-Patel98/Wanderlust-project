const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
//reuire model of listing
const Listing=require("../models/listening.js");

//require ExpressError
const ExpressError=require("../utils/ExpressError.js");

//require joi for validation for schema server side 
const{listingSchema,reviewSchema}=require("../schema.js");

//require model of reviews
const Review=require("../models/review.js");
const {isReviewsAuthor,validateReview,isLoggedIn}=require("../middleware.js");


//controllers of listing
const listingController=require("../controllers/review.js");



// Reviews post Route
router.post("/",isLoggedIn,validateReview, wrapAsync(listingController.createReview));
//Review delete Route
router.delete("/:reviewId",isLoggedIn,isReviewsAuthor,wrapAsync(listingController.deleteReview));

module.exports=router;