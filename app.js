const express=require('express');
const { default: mongoose } = require('mongoose');
const app=express();

//reuire model
const Listing=require("./models/listening.js");

//path
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//fetch requesting data like id
app.use(express.urlencoded({extended:true}));


//local host server
app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});
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

app.get("/testListing",async(req,res)=>{
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
});

//index route
app.get("/listing",async(req,res)=>{
    const values=await Listing.find({});
    res.render("listings/indexRoute",{values});
})

//CRUD KA CREATE OPERATIONS
app.get("/listing/new",(req,res)=>{
    res.render("listings/new");
})

//CRUD KA READ(SHOW) OPERATIONS

app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    res.render("listings/read",{idvalues});
});

//post new create
app.post("/listing",async(req,res)=>{
    const listall=new Listing(req.body.listall);
    await listall.save();
    res.redirect("/listing");
});



//Edit route
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const idvalues=await Listing.findById(id);
    res.render("listings/edit",{idvalues});
})


