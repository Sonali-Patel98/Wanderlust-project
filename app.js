const express=require('express');
const { default: mongoose } = require('mongoose');
const app=express();

//require joi for validation for schema server side 
const{listingSchema}=require("./schema.js");

//require ExpressError
const ExpressError=require("./utils/ExpressError.js");


//require custom WrapAsync
const WrapAsyncs=require("./utils/wrapAsync.js");

//require ejs-mate for layout
const ejsMate=require("ejs-mate");
app.engine('ejs', ejsMate);

//for only exist get post if want put delete this type then first install  npm i method-override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//reuire model
const Listing=require("./models/listening.js");

//path
const path=require("path");
const wrapAsync = require('./utils/wrapAsync.js');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


//require apply same css for all page
app.use(express.static(path.join(__dirname,"/public")));



//fetch requesting data like id
app.use(express.urlencoded({extended:true}));




app.get("/",(req,res)=>{
    res.send("hi i'm root");
});

//connect mongdb and nodejs through mongoose

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then((req)=>{
        console.log("connection is successfully");
    })
    .catch((err)=>{
        console.log(err);
    })


//first request 
app.get("/",(req,res)=>{
    res.send("fist server is working");
})

app.get("/testListing",wrapAsync(async(req,res)=>{
    let sample=new Listing({
        title:"My new Villa",
        description:"By the beach",
        price:1200,
        location:"Calangute,Goa",
        country: "India",
    });

    await sample.save();
    console.log("sample was saved");
    res.send("Successful testing");
}));

//index route
app.get("/listing",wrapAsync(async(req,res)=>{
    const values=await Listing.find({});
    res.render("listings/indexRoute",{values});
}));

//CRUD KA CREATE OPERATIONS
app.get("/listing/new",(req,res)=>{
    res.render("listings/new");
})

//CRUD KA READ(SHOW) OPERATIONS

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    res.render("listings/read",{idvalues});
}));

//post new create
app.post("/listing",WrapAsyncs(async(req,res,next)=>{
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400,result.error);
        }
        const listall=new Listing(req.body.listall);
        listall.image.filename="listingimage";
        await listall.save();
        res.redirect("/listing");
}));



//Edit route
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    res.render("listings/edit",{idvalues});
}));


//update route 
app.put("/listing/:id",wrapAsync(async(req,res)=>{
     if(!req.body.listall){
            throw new ExpressError(400,"send valid data for listing ");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listall);
    res.redirect(`/listing/${id}`);
}));



//delete route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deletelisting=await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});


//handling error middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});




//local host server
app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});

