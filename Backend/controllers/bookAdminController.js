import mongoose from "mongoose";
import Book from "../models/bookSchema.js";
import fs from "fs";

// Books CRUD Operation
const handleAddBook = async (req, res) => {
  if (req.user.role == 1) {
    const bookurl = req.files.bookfile[0].path;
    const thumbnailurl = req.files.thumbnail[0].path;
    //console.log(title,author,price,isbn,totalpage)
    const {
      title,
      author,
      publisher,
      price,
      language,
      isbn,
      totalpages,
      publishyear,
      edition,
      discount,
      category,
      description,
    } = req.body;
    if (!title || !author || !price || !isbn || !totalpages)
      return res.status(400).json({
        Result: false,
        Data: "Title, author, price, isbn and totalpage are required",
      });

    const bookisbn = await Book.findOne({ isbn: isbn }).exec();
    if (bookisbn)
      return res
        .status(204)
        .json({ Result: false, Data: "Book with this ISBN already exist" });

    try {
      const formatTitle = title
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const formatAuthor = author
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const formatPublisher = publisher
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const categories = category == "" ? [] : category
        .split(",")
        .map((cat) => new mongoose.Types.ObjectId(cat));

      const newBook = {
        title: formatTitle,
        author: formatAuthor,
        price: price,
        isbn: isbn,
        totalpages: totalpages,
        publisher: formatPublisher ?? "Ebookstore",
        language: language ?? "English",
        publishyear: publishyear ?? Number(new Date().getFullYear()),
        edition: edition ?? 1,
        discount: discount ?? 0,
        category: categories,
        description: description,
        bookurl: bookurl,
        thumbnail: thumbnailurl,
      };
      const result = await Book.create(newBook);
      console.log(result);
      await result.save();

      res.status(201).json({ Result: true, Data: "New Book Added" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleGetAllBooks = async (req, res) => {
  if (req.user.role) {
    try {
      const foundBook = await Book.find().sort({ title: 1 }).exec();
      res.status(200).json({ Result: true, Data: foundBook });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleUpdateBook = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  //console.log("updated data",updateData);
  if (req.user.role) {
    if (
      (updateData.title && updateData.title == "") ||
      (updateData.author && updateData.author == "") ||
      (updateData.price && updateData.price == "") ||
      (updateData.isbn && updateData.isbn == "") ||
      (updateData.totalpages && updateData.totalpages == "")
    )
      return res.status(400).json({
        Result: false,
        Data: "Title, author, price, isbn and totalpages are required",
      });

    try {
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (req.files && req.files.thumbnail) {
        updateData.thumbnail = req.files.thumbnail[0].path;
        if (book.thumbnail && fs.existsSync(book.thumbnail)) {
          console.log("thumbnail exist & deleting");
          fs.unlinkSync(book.thumbnail);
        }
      }
      if (req.files && req.files.bookfile) {
        updateData.bookurl = req.files.bookfile[0].path;
        if (book.bookurl && fs.existsSync(book.bookurl)) {
          console.log("thumbnail exist & deleting");
          fs.unlinkSync(book.bookurl);
        }
      }

      if (updateData.title) {
        updateData.title = updateData.title
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if (updateData.author) {
        updateData.author = updateData.author
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if (updateData.publisher) {
        updateData.publisher = updateData.publisher
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if (updateData.category) {
        updateData.category = updateData.category.split(",");
        updateData.category = updateData.category.filter((data) => data != "");
        updateData.category = updateData.category.map((cat) => {
          if (mongoose.Types.ObjectId.isValid(cat)) {
            return new mongoose.Types.ObjectId(cat);
          }
        });
      }
      console.log(updateData);
      const result = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!result)
        return res.status(404).json({ Result: false, Data: "Book Not Found" });

      res.status(200).json({ Result: true, Data: "Book Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleDeleteBook = async (req, res) => {
  if (req.user.role == 1) {
    const { bookId } = req.params;
    if (!bookId || bookId == "")
      return res
        .status(400)
        .json({ Result: false, Data: "Book ID is required" });

    try {
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Delete existing files if they exist
      if (book.thumbnail && fs.existsSync(book.thumbnail)) {
        fs.unlinkSync(book.thumbnail);
      }
      if (book.bookurl && fs.existsSync(book.bookurl)) {
        fs.unlinkSync(book.bookurl);
      }
      await Book.deleteOne({ _id: bookId }).exec();
      res.status(201).json({ Result: true, Data: "Book Deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

export { handleAddBook, handleGetAllBooks, handleUpdateBook, handleDeleteBook };
