import Book from "../models/bookSchema.js";
import Category from "../models/categorySchema.js";

const handleAddBook = async (req, res) => {
    console.log(req.user);
    if(req.user.role){
        const bookurl = req.files.bookfile[0].path;
        const thumbnailurl = req.files.thumbnail[0].path;

        const {title, author, publisher, price, language, isbn, totalpage, publishyear, edition, discount, category} = req.body;
        if(!title || !author || !price || !isbn || !totalpage) return res.status(400).json({"Result":false,"Data":"Title, author, price, isbn and totalpage are required"});

        try {
            const newBook = {
                "title":title,
                "author":author,
                "price":price,
                "isbn":isbn,
                "totalpage":totalpage,
                "publisher":publisher ?? "EbookStore",
                "language": language ?? "English",
                "publishyear":publishyear ?? Number(new Date().getFullYear()),
                "edition": edition ?? 1,
                "didcount": discount ?? 0,
                "category":category,
                "bookurl": bookurl,
                "thumbnail": thumbnailurl
            }
            const result = await Book.create(newBook);
            await result.save();

            console.log(result);
            res.status(201).json({"Result":true,"Data":"New Book Added"});
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).json({Result:false,Data:"Not Authorized"});
    }
}

const handleAddCategory = async (req, res) => {
    console.log("trying to add category")
    if(req.user.role){
        const {category} = req.body;
        if(!category || category == '') return res.status(400).json({"Result":false,"Data":"Category name is required"});

        const foundUser = await Category.findOne({name:category}).exec();
        if(foundUser) return res.status(403).json({"Result":false, "Data":"Category Already exist"});

        try {
            const newCategory = {
                "name":category
            }
            const result = await Category.create(newCategory);
            await result.save();

            console.log(result);
            res.status(201).json({"Result":true,"Data":"New Category Added"});
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).json({Result:false,Data:"Not Authorized"});
    }
}

const handleGetAllBooks = async (req, res) => {
    if(req.user.role){
        try {
            const foundBook = await Book.find().exec();
            res.status(200).json({"Result":true,"Data":foundBook});
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).json({Result:false,Data:"Not Authorized"});
    }
}


const handleGetCategory = async (req, res) => {
    if(req.user.role){
        try {
            const foundCategory = await Category.find().exec();
            res.status(200).json({"Result":true,"Data":foundCategory});
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).json({Result:false,Data:"Not Authorized"});
    }
}




// edit here 
const handleUpdateBook = async (req, res) => {
    if(req.user.role){
        const bookurl = req.files.bookfile[0].path;
        const thumbnailurl = req.files.thumbnail[0].path;

        const {title, author, publisher, price, language, isbn, totalpage, publishyear, edition, discount, category} = req.body;
        if(!title || !author || !price || !isbn || !totalpage) return res.status(400).json({"Result":false,"Data":"Title, author, price, isbn and totalpage are required"});

        try {
            
            const newBook = {
                "title":title,
                "author":author,
                "price":price,
                "isbn":isbn,
                "totalpage":totalpage,
                "publisher":publisher ?? "EbookStore",
                "language": language ?? "English",
                "publishyear":publishyear ?? Number(new Date().getFullYear()),
                "edition": edition ?? 1,
                "didcount": discount ?? 0,
                "category":category,
                "bookurl": bookurl,
                "thumbnail": thumbnailurl
            }
            const result = await Book.create(newBook);
            await result.save();

            console.log(result);
            res.status(201).json({"Result":true,"Data":"New Book Added"});
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(403).json({Result:false,Data:"Not Authorized"});
    }
}


export {handleAddBook, handleAddCategory, handleGetCategory, handleGetAllBooks};