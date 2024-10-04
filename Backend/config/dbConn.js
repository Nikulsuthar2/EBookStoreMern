import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;