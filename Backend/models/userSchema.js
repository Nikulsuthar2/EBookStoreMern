import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type:Number, default:0},
    wishlist:{type:[Schema.Types.ObjectId], ref:"Book", default:[]},
    cart:{type:[Schema.Types.ObjectId], ref:"Book", default:[]},
    mybooks:{type:[Schema.Types.ObjectId], ref:"Book", default:[]},
    refreshToken: String,
    createdAt: {type:Date, default:Date.now()}
});

const User = mongoose.model('User', userSchema); 
export default User;