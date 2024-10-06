import express from 'express'
import { handleAddBook, handleAddCategory, handleDeleteBook, handleDeleteCategory, handleGetAllBooks, handleGetCategory, handleGetUserList, handleUpdateCategory } from '../controllers/bookAdminController.js';
import multer from 'multer';
import path from 'path';

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

bookAdminRouter.get("/getallbooks", handleGetAllBooks);
bookAdminRouter.post("/deletebooks", handleDeleteBook);
bookAdminRouter.post("/addbook", upload.fields([{name:'thumbnail'},{name:'bookfile'}]), handleAddBook);
bookAdminRouter.get("/getcategory", handleGetCategory);
bookAdminRouter.post("/addcategory", handleAddCategory);
bookAdminRouter.post("/updatecategory", handleUpdateCategory);
bookAdminRouter.post("/deletecategory", handleDeleteCategory);

bookAdminRouter.get("/getallusers", handleGetUserList);

export default bookAdminRouter;