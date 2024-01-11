
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    marksheet10: String, // Cloudinary URL for 10th marksheet
    marksheet12: String, // Cloudinary URL for 12th marksheet
    aadharCard: String   // Cloudinary URL for Aadhar card

},{ timestamps: true })
module.exports= new mongoose.model("Cloud",userSchema);