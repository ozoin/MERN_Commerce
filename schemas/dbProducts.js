import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title:String,
    img:String,
    price:Number,
    rating:Number,
});

export default mongoose.model('Products',productSchema);
