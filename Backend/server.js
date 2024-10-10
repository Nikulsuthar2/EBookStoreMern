import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/dbConn.js';
import url from 'url'
import path from 'path'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import credentials from './middleware/credentials.js';
import verifyJWT from './middleware/verifyJWT.js';
import corsOptions from './config/corsConfig.js'
import userAuthRouter from './routes/userAuthRoute.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoutes.js';

const PORT = process.env.PORT ?? 8080;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//connect to database 
connectDB();
const app = express();

// check creadentials and cors and cookie
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());

// enble request body parsing or reading
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// upload directory for pdfs public access
app.use("/uploads",express.static(path.join(__dirname,"uploads/")));

// custom routes
app.use("/auth", userAuthRouter);

// custom routes which require JWT Verification
app.use(verifyJWT);
app.use("/admin",adminRouter);
app.use("/user",userRouter);


// Starting Route 
app.get("/",(req,res)=>{
    res.send("Welcome to ONLINE E-Book Store");
})

app.use((err,req,res,next)=> {
    console.log(err);
    next();
})

mongoose.connection.once('open', ()=>{
    console.log("connected to mongoDB");
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`)
        console.log(`Click on http://localhost:${PORT}`)
    })
})

// to generate tokens
// require("crypto").randomBytes(64).toString('hex')