const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUSer=new User({email,username});
        const registerUSer=await User.register(newUSer,password);
        console.log(registerUSer);
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listing");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post(
    "/login",
    passport.authenticate("local",
        {
            failureRedirect:'/login',
            failureFlash:true
        }
    ),
    async(req,res)=>{
        req.flash("success","welcome to Wanderlust!");
        res.redirect("/listing");
    }
)
module.exports=router;