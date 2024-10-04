import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {type:"String", required: true}
});

const Category = mongoose.model('BookCategory', categorySchema); 
export default Category;