const express=require("express");
const router=express.Router();

//reuire model of listing
const Listing=require("../models/listening.js");

//require custom WrapAsync
const WrapAsyncs=require("../utils/wrapAsync.js");

//require ExpressError
const ExpressError=require("../utils/ExpressError.js");

const wrapAsync = require('../utils/wrapAsync.js');

//require joi for validation for schema server side 
const{listingSchema,reviewSchema}=require("../schema.js");


//validation for Schema(middleware) listing
const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};






//index route
router.get("/",wrapAsync(async(req,res)=>{
    const values=await Listing.find({});
    res.render("listings/indexRoute",{values});
}));

//CRUD KA CREATE OPERATIONS
router.get("/new",(req,res)=>{
    res.render("listings/new");
})

//CRUD KA READ(SHOW) OPERATIONS

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id).populate("reviews");
    if(!idvalues){
         req.flash("error","Listing you are requesting  doesn't exist");
         return res.redirect("/listing");
    }
    res.render("listings/read",{idvalues});
}));



//post new create
router.post("/",
    validatelisting,
    WrapAsyncs(async(req,res,next)=>{
        const listall=new Listing(req.body.listall);
        listall.image.filename="listingimage";
        await listall.save();
        req.flash("success","New Listing Created");
        res.redirect("/listing");
    })
);



//Edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    if(!idvalues){
         req.flash("error","Listing you are requesting  doesn't exist");
         return res.redirect("/listing");
    }
    res.render("listings/edit",{idvalues});
}));


//update route 
router.put("/:id",validatelisting,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listall);
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
}));



//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletelisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
}));

module.exports=router;