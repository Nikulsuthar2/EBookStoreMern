import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    publisher: {type: String, default: "EbookStore"},
    language: {type: String, default: "English"},
    isbn: {type:Number},
    totalpages: {type:Number},
    publishyear: {type:Number, default: Number(new Date().getFullYear())},
    edition: {type:Number, default:1},
    price: {type:Number},
    discount: {type:Number, default:0},
    description:{type:String, default:""},
    category:{type:[Schema.Types.ObjectId], ref:"BookCategory", default:[]},
    thumbnail: {type: String, required: true},
    bookurl: {type: String, required: true},
    createdAt: {type:Date, default:Date.now()}
});

const Book = mongoose.model('Book', bookSchema); 
export default Book;