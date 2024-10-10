import Book from "../models/bookSchema.js";
import Category from "../models/categorySchema.js";
import User from "../models/userSchema.js";

const handleGetStats = async (req, res) => {
  const stats = {};
  if (req.user.role) {
    try {
      const foundUser = await User.find().exec();
      stats.totalUser = foundUser.length;
      const foundBook = await Book.find().exec();
      stats.totalBook = foundBook.length;
      const foundCategory = await Category.find().exec();
      stats.totalCategory = foundCategory.length;
      
      res.status(200).json({ Result: true, Data: stats });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
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
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          products: 1,
        },
      },
    ]);
    res.status(200).json({ Result: true, Data: foundBooks });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetBookDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const foundBook = await Book.findOne({ _id: id }).exec();
    res.status(200).json({ Result: true, Data: foundBook });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetLatestBookDetails = async (req, res) => {
  try {
    const foundBook = await Book.findOne()
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    res.status(200).json({ Result: true, Data: foundBook });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetCategoryBooks = async (req, res) => {};

export { handleGetCategoryWiseBooks, handleGetBookDetails, handleGetLatestBookDetails, handleGetStats };
