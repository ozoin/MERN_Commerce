import mongoose from "mongoose";

const promoSchema = mongoose.Schema({
    code: String,
    discount: Number
});

export default mongoose.model('Promos',promoSchema);
