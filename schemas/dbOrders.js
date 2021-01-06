import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    basket:[],
    shipping:[],
    amount: Number,
    created: String,
    buyerId: String,
    completed: {type:Boolean, default:false}
})

export default mongoose.model('Order',orderSchema);
