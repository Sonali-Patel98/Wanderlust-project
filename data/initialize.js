const mongoose=require("mongoose");
const initdata=require("./data.js");
// const Listing=require("./models/listing");
const Listing=require("../models/listening.js");

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

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:"6957d60673ac4b2a3ef670de",

    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();