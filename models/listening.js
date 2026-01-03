const mongoose=require("mongoose");
const listing=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1767016311533-8365d673f91b?q=80&w=1318&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wY",
        }
    },

    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
})

const Listing=mongoose.model("Listing",listing);
module.exports=Listing;