import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {type:String, required:true,unique:true},
    password: {type:String, required:true, minlength:5},
    role: {type:Number, default:0},
    resetToken:String,
    expireToken:Date,
})

export default mongoose.model('user',userSchema);
