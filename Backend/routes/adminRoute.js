import express from 'express'
import multer from 'multer';
import path from 'path';
import {handleAddBook, handleDeleteBook, handleGetAllBooks, handleUpdateBook} from '../controllers/bookAdminController.js'
import { handleGetBookDetails, handleGetStats } from '../controllers/commanDataController.js';
import { handleAddCategory, handleDeleteCategory, handleGetCategory, handleUpdateCategory } from '../controllers/categoryAdminController.js';
import { handleDeleteUser, handleGetUserList } from '../controllers/userAdminController.js';
import { handleBookWiseMonthlyPurchase, handleBookWisePurchase, handleBookWiseYearlyPurchase, handleGetAllPurchases, handleGetMonthlyPurchase, handleGetYearlyPurchase, } from '../controllers/purchaseAdminController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(file.fieldname === 'bookfile')
            cb(null, "uploads/pdfbooks/");
        else if (file.fieldname === 'thumbnail')
            cb(null, "uploads/thumbnails/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.originalname.split(".")[0]+"_"+Date.now().toString()+ext);
    }
});
const upload = multer({storage});

const adminRouter = express.Router();

adminRouter.get('/dashboardstats', handleGetStats);

adminRouter.post("/addbook", upload.fields([{name:'thumbnail'},{name:'bookfile'}]),handleAddBook);
adminRouter.get("/getallbooks", handleGetAllBooks);
adminRouter.get("/getbookdetails/:id", handleGetBookDetails);
adminRouter.put("/updatebook/:id",upload.fields([{name:'thumbnail'},{name:'bookfile'}]),  handleUpdateBook);
adminRouter.delete("/deletebook/:bookId", handleDeleteBook);

adminRouter.get("/getcategory", handleGetCategory);
adminRouter.post("/addcategory", handleAddCategory);
adminRouter.put("/updatecategory", handleUpdateCategory);
adminRouter.delete("/deletecategory/:catId", handleDeleteCategory);

adminRouter.get("/getallusers", handleGetUserList);
adminRouter.delete("/deleteuser", handleDeleteUser);

adminRouter.get("/allpurchase", handleGetAllPurchases);
adminRouter.get("/monthypurchase/:year/:month", handleGetMonthlyPurchase);
adminRouter.get("/yearlypurchase/:year", handleGetYearlyPurchase);
adminRouter.get("/bookwisepurchase", handleBookWisePurchase);
adminRouter.get("/bookwisemonthypurchase/:year/:month", handleBookWiseMonthlyPurchase);
adminRouter.get("/bookwiseyearlypurchase/:year", handleBookWiseYearlyPurchase);

export default adminRouter;