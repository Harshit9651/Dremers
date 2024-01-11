const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    Email:String,
    password:String,
    Number:Number,
    username:String,
    Fname:String,
    Lname:String,
    Gender:String,
    Descripition:String,
    Role:String,
    Goal:String,
    city:String,
    HomeTown:String,
   DOB:Date,
   SAdhar:Number,
   firstaddress:String,
   lastaddress:String,
   tenth:String,
   evelenth:String,
   IFSC:String,
   Accountno:String,

   //father schema
   FFName:String,
   FLname:String,
   FNumber:Number,
   FAdhar:Number,
   occupation:String,
   WName:String,
   WNumber:Number,
   FDOB:Date,
   ElectricCityBill:String,
   Statement:String,
   studentImage:String,
   marksheet10th:String,
marksheet11th:String,
latter:String,




})
module.exports= new mongoose.model("Student",userSchema);

