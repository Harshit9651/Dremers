const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:String,review:String,photo:String,role:String,rating:Number
})
module.exports= new mongoose.model("Review",userSchema);

