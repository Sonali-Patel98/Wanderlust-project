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

//validation for Schema(middleware) review
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};



// Reviews post Route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","New Reviews Created");
    res.redirect(`/listing/${listing._id}`);
}));
//Review delete Route
router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
       let {id,reviewId} =req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Reviews deleted");
       res.redirect(`/listing/${id}`);
    })
    
);

module.exports=router;