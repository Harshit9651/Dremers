const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    studentName:String,bankName:String,bankerName:String,phoneNumber:String,branch:String,Story:String,Image:String

})
module.exports= new mongoose.model("EducationLoan",userSchema);

