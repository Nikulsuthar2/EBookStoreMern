import Book from "../models/bookSchema.js";
import Category from "../models/categorySchema.js";
import Purchase from "../models/purchaseSchema.js";
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
    const user = await User.findById(req.user).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Message: "User not found" });
    }

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
          products: {
            $map: {
              input: "$products",
              as: "book",
              in: {
                $mergeObjects: [
                  "$$book",
                  {
                    isInCart: { $in: ["$$book._id", user.cart] },
                    isInWishlist: { $in: ["$$book._id", user.wishlist] },
                    isInMybooks: { $in: ["$$book._id", user.mybooks] },
                  },
                ],
              },
            },
          },
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
    if (!foundBook) {
      return res.status(404).json({ Result: false, Data: "Book not found" });
    }

    const user = await User.findById(req.user).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Data: "User not found" });
    }

    const isInCart = user.cart?.includes(id);
    const isInWishlist = user.wishlist?.includes(id);
    const isInMybooks = user.mybooks?.includes(id);

    res.status(200).json({
      Result: true,
      Data: foundBook,
      isInCart,
      isInWishlist,
      isInMybooks,
    });
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
    if (!foundBook) {
      return res.status(404).json({ Result: false, Data: "Book not found" });
    }

    const user = await User.findById(req.user).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Data: "User not found" });
    }

    const isInCart = user.cart?.includes(foundBook._id);
    const isInWishlist = user.wishlist?.includes(foundBook._id);
    const isInMybooks = user.mybooks?.includes(foundBook._id);

    res
      .status(200)
      .json({
        Result: true,
        Data: foundBook,
        isInCart,
        isInWishlist,
        isInMybooks,
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetCategoryBooks = async (req, res) => {
  const { catId } = req.params;
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Message: 'User not found' });
    }

    const foundBooks = await Book.find({ category: catId }).exec();

    const booksWithFlags = foundBooks.map(book => ({
      ...book.toObject(),
      isInCart: user.cart?.includes(book._id),
      isInWishlist: user.wishlist?.includes(book._id),
      isInMybooks: user.mybooks?.includes(book._id),
    }));

    res.status(200).json({ Result: true, Data: booksWithFlags });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleAddToWishlist = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne(
      { _id: req.user },
      { $addToSet: { wishlist: bookId } }
    );
    res.status(200).json({ Result: true, Data: "Book Added In Wishlist" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleRemoveFromWishlist = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user }, { $pull: { wishlist: bookId } });
    res.status(200).json({ Result: true, Data: "Book Removed From Wishlist" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleAddToCart = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user }, { $addToSet: { cart: bookId } });
    res.status(200).json({ Result: true, Data: "Book Added TO Cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleRemoveFromCart = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user }, { $pull: { cart: bookId } });
    res.status(200).json({ Result: true, Data: "Book Removed From Cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleAddToMyBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user }, { $addToSet: { mybooks: bookId } });
    res.status(200).json({ Result: true, Data: "Book Added To My Books" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetMyDetails = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user });
    res.status(200).json({ Result: true, Data: foundUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleUpdateMyDetails = async (req, res) => {
  const { name, email } = req.body;
  try {
    const foundUser = await User.findByIdAndUpdate(req.user, { name, email });
    res.status(200).json({ Result: true, Data: "Your data is updated" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleSearchBook = async (req, res) => {
  const { query } = req.query;

  if (!query)
    return res.status(400).json({ error: "Please provide a query string." });

  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ Result: true, Data: books });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for books." });
  }
};

const handleGetMyBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("mybooks");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ Result: true, Data: user.mybooks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the books." });
  }
};

const handleGetMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("wishlist");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ Result: true, Data: user.mybooks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the books." });
  }
};

const handleGetMyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("cart");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ Result: true, Data: user.mybooks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the books." });
  }
};

const handlePurchaseBook = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0 || !totalAmount) {
    return res
      .status(400)
      .json({ error: "Items, and total amount are required." });
  }

  if (!items.every((item) => item.bookId && item.price)) {
    return res
      .status(400)
      .json({ error: "Each item must include a bookId and a price." });
  }

  if (req.user) {
    try {
      const purchase = new Purchase({
        userId: req.user,
        items,
        totalAmount,
      });
      await purchase.save();

      const bookIds = items.map((item) => item.bookId);
      await User.findByIdAndUpdate(
        req.user,
        { $addToSet: { mybooks: { $each: bookIds } } },
        { new: true }
      );

      res.status(201).json({
        Result: true,
        Data: "Purchase successful and books added to user library",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while processing the purchase." });
    }
  } else {
    req
      .status(404)
      .json({ Result: false, Data: "User Not Found Please Login" });
  }
};

export {
  handleGetCategoryWiseBooks,
  handleGetBookDetails,
  handleGetLatestBookDetails,
  handleGetStats,
  handleGetCategoryBooks,
  handleAddToWishlist,
  handleRemoveFromWishlist,
  handleAddToCart,
  handleRemoveFromCart,
  handleAddToMyBook,
  handleGetMyDetails,
  handleUpdateMyDetails,
  handleSearchBook,
  handleGetMyBooks,
  handleGetMyWishlist,
  handleGetMyCart,
  handlePurchaseBook,
};
