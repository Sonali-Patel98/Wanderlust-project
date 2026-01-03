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
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();