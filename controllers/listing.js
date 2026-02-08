const Listing =require("../models/listening");
module.exports.index=(async(req,res)=>{
    const values=await Listing.find({});
    res.render("listings/indexRoute",{values});
});
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
    const listall=new Listing(req.body.listall);
    listall.owner=req.user._id;
    listall.image.filename="listingimage";
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
    await Listing.findByIdAndUpdate(id,req.body.listall);
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
});
module.exports.delete=(async(req,res)=>{
    const {id}=req.params;
    const deletelisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
});