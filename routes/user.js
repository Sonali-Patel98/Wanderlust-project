const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const loginAndSignup=require("../controllers/loginAndSignup.js");
router.route("/signup")
    .get(loginAndSignup.rendersignup)
    .post(wrapAsync(loginAndSignup.postsignup));
router.route("/login")
    .get(loginAndSignup.renderlogin)
    .post(
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect:'/login',
            failureFlash:true
        }),
    loginAndSignup.postlogin
)

router.get("/logout",loginAndSignup.logout);
module.exports=router;