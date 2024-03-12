const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    Image:String,
    Fname:String,
    Email:String,
    password:String,
    Number:Number,
    username:String,
    Lname:String,
    Descripition:String,
    Amount:String,
    Countery:String,
    Randomdigit:String,
    marksheet10:String,
    marksheet12:String,
    role: {
        type: String,
        default: 'donor'
    },
    For:String,
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]

     
},{ timestamps: true })
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},"Ramthisisadremaessitethatsbdygddhghdydyggdygdgydgdygyfdyfdydyfyfdd")
   this.tokens = this.tokens.concat({token:token});
   await this.save();
   return token;
    }catch(err){
        console.log(err)
    }
}

module.exports=new mongoose.model("Doner",userSchema)


