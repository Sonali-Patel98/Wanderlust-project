const User=require("../models/user");
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.postsignup=(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUSer=new User({email,username});
        const registerUSer=await User.register(newUSer,password);
        console.log(registerUSer);
        req.login(registerUSer,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listing");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
});
module.exports.renderlogin=(req,res)=>{res.render("users/login.ejs")};
module.exports.postlogin=async(req,res)=>{
    req.flash("success","welcome to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listing");
    });
};