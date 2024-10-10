import express from 'express'
import { handleAddBook, handleAddCategory, handleDeleteBook, handleDeleteCategory, handleGetAllBooks, handleGetBookDetails, handleGetCategory, handleGetCategoryWiseBooks, handleGetLatestBookDetails, handleUpdateBook, handleUpdateCategory } from '../controllers/bookAdminController.js';
import multer from 'multer';
import path from 'path';
import { handleGetUserList } from '../controllers/adminController.js';

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

const bookAdminRouter = express.Router();

bookAdminRouter.post("/addbook", upload.fields([{name:'thumbnail'},{name:'bookfile'}]), handleAddBook);
bookAdminRouter.get("/getallbooks", handleGetAllBooks);
bookAdminRouter.get("/getbookdetails/:id", handleGetBookDetails);
bookAdminRouter.get("/getlatestbookdetails", handleGetLatestBookDetails);
bookAdminRouter.get("/getcategorywisebooks", handleGetCategoryWiseBooks);
bookAdminRouter.post("/updatebook/:id",upload.fields([{name:'thumbnail'},{name:'bookfile'}]),  handleUpdateBook);
bookAdminRouter.post("/deletebook", handleDeleteBook);

bookAdminRouter.get("/getcategory", handleGetCategory);
bookAdminRouter.post("/addcategory", handleAddCategory);
bookAdminRouter.post("/updatecategory", handleUpdateCategory);
bookAdminRouter.post("/deletecategory", handleDeleteCategory);

bookAdminRouter.get("/getallusers", handleGetUserList);

export default bookAdminRouter;