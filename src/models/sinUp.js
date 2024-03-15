const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name:{
        type: String,
  
  },
  email:{
    type:String,
  
  },
  role:String,
  password:String,
  number:Number,
  token:String,
 
  
})
module.exports= new mongoose.model("SinUpDremers",userSchema);

