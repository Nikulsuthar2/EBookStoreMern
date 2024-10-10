import express from 'express'
import { handleGetBookDetails, handleGetCategoryWiseBooks, handleGetLatestBookDetails } from '../controllers/commanDataController.js';

const userRouter = express.Router();

userRouter.get("/getbookdetails/:id", handleGetBookDetails);
userRouter.get("/getlatestbookdetails", handleGetLatestBookDetails);
userRouter.get("/getcategorywisebooks", handleGetCategoryWiseBooks);

export default userRouter;