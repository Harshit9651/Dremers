const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
sname:String,
Eligibility:String,
deadline:String,
Descripition:String,
Image:String,
criteria:String,
Link:String,




})
module.exports= new mongoose.model("Scholerships",userSchema);

