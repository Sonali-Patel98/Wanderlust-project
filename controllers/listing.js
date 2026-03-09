const Listing =require("../models/listening");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_tOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
module.exports.index=async(req,res)=>{
    const values=await Listing.find({});
    res.render("listings/indexRoute",{values});

    


};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};
module.exports.alllisting=(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"author",
            },
        })
        .populate("owner");
    if(!idvalues){
         req.flash("error","Listing you are requesting  doesn't exist");
         return res.redirect("/listing");
    }
    res.render("listings/read",{idvalues});
});
module.exports.newPostCreate=(async(req,res,next)=>{
    // geocoding in structured input mode
    let response=await geocodingClient
    .forwardGeocode({
        query:req.body.listall.location,
        limit:1,
    })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    const listall=new Listing(req.body.listall);
    listall.owner=req.user._id;
    listall.image.filename="listingimage";
    listall.image={url,filename};
    listall.geometry=response.body.features[0].geometry;
    await listall.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
});
module.exports.edit=(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    if(!idvalues){
         req.flash("error","Listing you are requesting  doesn't exist");
         return res.redirect("/listing");
    }
    res.render("listings/edit",{idvalues})
});
module.exports.update=(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body.listall);
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
});
module.exports.delete=(async(req,res)=>{
    const {id}=req.params;
    const deletelisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
});




