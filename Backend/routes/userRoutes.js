import express from 'express'
import { handleAddToCart, handleAddToMyBook, handleAddToWishlist, handleGetBookDetails, handleGetCategoryBooks, handleGetCategoryWiseBooks, handleGetLatestBookDetails, handleGetMyBooks, handleGetMyCart, handleGetMyDetails, handleGetMyPurchaseData, handleGetMyWishlist, handlePurchaseBook, handleRemoveFromCart, handleRemoveFromWishlist, handleSearchBook, handleUpdateMyDetails } from '../controllers/commanDataController.js';

const userRouter = express.Router();

userRouter.get("/getcategorywisebooks", handleGetCategoryWiseBooks);
userRouter.get("/getbookdetails/:id", handleGetBookDetails);
userRouter.get("/getlatestbookdetails", handleGetLatestBookDetails);
userRouter.get("/getcategorybooks/:catId", handleGetCategoryBooks);

userRouter.post("/addtowishlist/:bookId", handleAddToWishlist);
userRouter.delete("/removefromwishlist/:bookId", handleRemoveFromWishlist);
userRouter.get("/mywishlist", handleGetMyWishlist);

userRouter.post("/addtocart/:bookId", handleAddToCart);
userRouter.delete("/removefromcart/:bookId", handleRemoveFromCart);
userRouter.get("/mycart", handleGetMyCart);

userRouter.post("/addtomybooks/:bookId", handleAddToMyBook);
userRouter.get("/mybooks", handleGetMyBooks);

userRouter.get("/getmydetails", handleGetMyDetails);
userRouter.put("/updatemydetails", handleUpdateMyDetails);

userRouter.get("/searchbooks", handleSearchBook);
userRouter.post("/purchasebooks", handlePurchaseBook);

userRouter.get("/mypurchasedata", handleGetMyPurchaseData);

export default userRouter;