if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

  
const express=require('express');
const { default: mongoose } = require('mongoose');
const app=express();


//require ExpressError
const ExpressError=require("./utils/ExpressError.js");




//require ejs-mate for layout
const ejsMate=require("ejs-mate");
app.engine('ejs', ejsMate);

//for only exist get post if want put delete this type then first install  npm i method-override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//reuire model of listing
// const Listing=require("./models/listening.js");

//path
const path=require("path");
const wrapAsync = require('./utils/wrapAsync.js');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


//require apply same css for all page
app.use(express.static(path.join(__dirname,"/public")));



//fetch requesting data like id
app.use(express.urlencoded({extended:true}));

const listingsRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");

//require for express-session for cookies
const session=require("express-session");

//require for rotes user sign and login
const userRouter=require("./routes/user.js");
// requiring for connect-mongo below code
//  for when we are every time login again
//  again i want that at least 14 days stay login 
// if did'nt open my website so after 14
//  days automatically logout that type code is below
const MongoStore=require('connect-mongo');
const dbUrl=process.env.ATLASDB_URL;

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,   //when not updating in session just refereshing so don't need to login again and again so needed this
});
store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 *1000,   //for 7 days
         maxAge:7 * 24 *60 * 60 *1000,
         httpOnly:true,
    },
};




app.use(session(sessionOptions));



const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//for flash
const flash=require("connect-flash");
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
// //first request 
// app.get("/",(req,res)=>{
//     res.send("fist server is working");
// })
 // for resturing revies and from reviews.js
app.use("/listing/:id/reviews",reviewRouter);
// for resturing listing and from listing.js
app.use("/listing",listingsRouter);

app.use("/",userRouter);

// app.get("/",(req,res)=>{
//     res.send("hi i'm root");
// });


//connect mongdb and nodejs through mongoose
main()
    .then((req)=>{
        console.log("connection is successfully");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}







// app.get("/testListing",wrapAsync(async(req,res)=>{
//     let sample=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country: "India",
//     });

//     await sample.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// }));







app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});


// //handling error middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});





//local host server
app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});

