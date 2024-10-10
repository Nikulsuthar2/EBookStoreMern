import mongoose from "mongoose";
import Book from "../models/bookSchema.js";
import Category from "../models/categorySchema.js";

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
        console.log(category)
      const categories = category
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
      console.log("here");
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

const handleGetBookDetails = async (req, res) => {
  const { id } = req.params;
  if (req.user.role) {
    try {
      const foundBook = await Book.findOne({ _id: id }).exec();
      res.status(200).json({ Result: true, Data: foundBook });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleGetLatestBookDetails = async (req, res) => {
  try {
    const foundBook = await Book.findOne().sort({ createdAt: -1 }).limit(1).exec();
    res.status(200).json({ Result: true, Data: foundBook });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetCategoryWiseBooks = async (req, res) => {
  try {
    const foundBooks = await Book.aggregate([
      { $unwind: "$category" },
      {
        $lookup: {
          from: "bookcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          products: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          products: 1
        }
      }
    ]);
    res.status(200).json({ Result: true, Data: foundBooks });
  } catch (error) {
    res.status(500).send(error);
  }
}

const handleUpdateBook = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  console.log("updated data",updateData);
  if (req.user.role) {
    if (req.files && req.files.thumbnail) {
      updateData.thumbnail = req.files.thumbnail[0].path;
    }
    if (req.files && req.files.bookfile) {
      updateData.bookurl = req.files.bookfile[0].path;
    }

    if (
      updateData.title  && updateData.title == "" ||
      updateData.author && updateData.author == "" ||
      updateData.price && updateData.price == "" ||
      updateData.isbn && updateData.isbn == "" ||
      updateData.totalpages && updateData.totalpages == ""
    )
      return res.status(400).json({
        Result: false,
        Data: "Title, author, price, isbn and totalpages are required",
      });

    try {
      if(updateData.title){
        updateData.title = updateData.title
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if(updateData.author){
        updateData.author = updateData.author
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if(updateData.publisher){
        updateData.publisher = updateData.publisher
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if(updateData.category){
        updateData.category = updateData.category
          .split(",")
          .map((cat) => new mongoose.Types.ObjectId(cat));
      }

      const result = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!result)
        return res.status(404).json({ Result: false, Data: "Book Not Found" });

      res.status(200).json({ Result: true, Data: "Book Updated" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleDeleteBook = async (req, res) => {
  if (req.user.role == 1) {
    const { bookId } = req.body;
    if (!bookId || bookId == "")
      return res
        .status(400)
        .json({ Result: false, Data: "Book ID is required" });

    try {
      await Book.deleteOne({ _id: bookId }).exec();
      res.status(201).json({ Result: true, Data: "Book Deleted" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

// Category CRUD Operation
const handleAddCategory = async (req, res) => {
  if (req.user.role) {
    const { category } = req.body;
    if (!category || category == "")
      return res
        .status(400)
        .json({ Result: false, Data: "Category name is required" });

    const foundUser = await Category.findOne({ name: category }).exec();
    if (foundUser)
      return res
        .status(403)
        .json({ Result: false, Data: "Category Already exist" });

    try {
      const newCategory = {
        name: category,
      };
      const result = await Category.create(newCategory);
      await result.save();

      console.log(result);
      res.status(201).json({ Result: true, Data: "New Category Added" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleGetCategory = async (req, res) => {
  if (req.user.role) {
    try {
      const foundCategory = await Category.find().exec();
      res.status(200).json({ Result: true, Data: foundCategory });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleUpdateCategory = async (req, res) => {
  if (req.user.role == 1) {
    const { catId, newName } = req.body;
    if (!newName || newName == "")
      return res
        .status(400)
        .json({ Result: false, Data: "Category name is required" });

    let str = newName.trim();
    str = str.charAt(0).toUpperCase() + str.slice(1);

    const foundCategory = await Category.findOne({ _id: catId }).exec();
    if (!foundCategory)
      return res
        .status(403)
        .json({ Result: false, Data: "Category doesm't exist" });

    try {
      await Category.updateOne({ _id: catId }, { name: newName }).exec();
      res.status(201).json({ Result: true, Data: "Category Updated" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleDeleteCategory = async (req, res) => {
  if (req.user.role == 1) {
    const { catId } = req.body;
    if (!catId || catId == "")
      return res
        .status(400)
        .json({ Result: false, Data: "Category ID is required" });

    try {
      await Category.deleteOne({ _id: catId }).exec();
      res.status(201).json({ Result: true, Data: "Category Deleted" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

export {
  handleAddBook,
  handleGetAllBooks,
  handleGetBookDetails,
  handleGetLatestBookDetails,
  handleGetCategoryWiseBooks,
  handleUpdateBook,
  handleDeleteBook,
  handleAddCategory,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
