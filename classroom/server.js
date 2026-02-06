const express=require("express");
const app=express();
// const users=require()
const session=require("express-session");


app.use(session({secret:"mysupersecretstring"}));
app.get("/",(req,res)=>{
    res.send("test successful!");
})
app.listen(3000,()=>{
    console.log("server is listening to 3000");
});