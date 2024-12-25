import Book from "../models/bookSchema.js";
import Category from "../models/categorySchema.js";
import Purchase from "../models/purchaseSchema.js";
import User from "../models/userSchema.js";
import fs from 'fs';

const handleGetStats = async (req, res) => {
  const stats = {};
  if (req.user.role) {
    try {
      const foundUser = await User.find({role:{$ne : 1}}).exec();
      stats.totalUser = foundUser.length;
      const foundBook = await Book.find().exec();
      stats.totalBook = foundBook.length;
      const foundCategory = await Category.find().exec();
      stats.totalCategory = foundCategory.length;
      const totalEarnings = await Purchase.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$totalAmount' },
          },
        },
        {
          $project: {
            _id: 0,
            totalEarnings: 1,
          },
        },
      ]);
  
      stats.totalEarnings = totalEarnings[0]?.totalEarnings || 0;

      const categoryWiseBooks = await Book.aggregate([
        {
          $lookup: {
            from: "bookcategories",
            localField: "category",
            foreignField: "_id",
            as: "categories", 
          },
        },
        { $unwind: "$categories" },
        {
          $group: {
            _id: "$categories.name",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      stats.categoryWiseData = categoryWiseBooks;


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
    const user = await User.findById(req.user.id).exec();
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
          _id: { id: "$categoryInfo._id", name: "$categoryInfo.name" },
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id.id",
          categoryName: "$_id.name",
          products: {
            $slice: [
              {
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
              10,
            ],
          },
        },
      },
      {
        $sort: { categoryName: 1 }, // Sort in ascending order by category name
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
    const foundBook = await Book.findOne({ _id: id })
      .populate("category")
      .exec();
    if (!foundBook) {
      return res.status(404).json({ Result: false, Data: "Book not found" });
    }

    const user = await User.findById(req.user.id).exec();
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

    const user = await User.findById(req.user.id).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Data: "User not found" });
    }

    const isInCart = user.cart?.includes(foundBook._id);
    const isInWishlist = user.wishlist?.includes(foundBook._id);
    const isInMybooks = user.mybooks?.includes(foundBook._id);

    res.status(200).json({
      Result: true,
      Data: foundBook,
      isInCart,
      isInWishlist,
      isInMybooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const handleGetCategoryBooks = async (req, res) => {
  const { catId } = req.params;
  try {
    const user = await User.findById(req.user.id).exec();
    if (!user) {
      return res.status(404).json({ Result: false, Message: "User not found" });
    }

    const foundBooks = await Book.find({ category: catId }).exec();

    const booksWithFlags = foundBooks.map((book) => ({
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
  console.log("Adding to wishlist");
  const { bookId } = req.params;
  try {
    await User.updateOne(
      { _id: req.user.id },
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
    await User.updateOne({ _id: req.user.id }, { $pull: { wishlist: bookId } });
    res.status(200).json({ Result: true, Data: "Book Removed From Wishlist" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleAddToCart = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user.id }, { $addToSet: { cart: bookId } });
    res.status(200).json({ Result: true, Data: "Book Added To Cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleRemoveFromCart = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne({ _id: req.user.id }, { $pull: { cart: bookId } });
    res.status(200).json({ Result: true, Data: "Book Removed From Cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleClearCart = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $set: { cart: [] } });
    res.status(200).json({ Result: true, Data: "Book Removed From Cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleAddToMyBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { mybooks: bookId } }
    );
    res.status(200).json({ Result: true, Data: "Book Added To My Books" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleGetMyDetails = async (req, res) => {
  try {
    const foundUser = await User.findOne({ _id: req.user.id }).populate(['mybooks', 'wishlist']).exec();
    // Convert mybooks to a Set for quick lookup
    const myBooksSet = new Set(foundUser.mybooks.map(book => book._id.toString()));
    const cartSet = new Set(foundUser.cart.map(book => book._id.toString()));

    // Add isInCart and isInMyBook fields to each book in the wishlist
    const enhancedWishlist = foundUser.wishlist.map(book => {
      return {
        ...book.toObject(),
        isInCart: cartSet.has(book._id.toString()),
        isInMyBook: myBooksSet.has(book._id.toString()),
        isInWishlist: true,
      };
    });
    res.status(200).json({ Result: true, Data: { ...foundUser.toObject(), wishlist: enhancedWishlist } });
  } catch (error) {
    res.status(500).send(error);
  }
};

const handleUpdateMyDetails = async (req, res) => {
  const { name, email } = req.body;
  try {
    const foundUser = await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
    });
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
    const user = await User.findById(req.user.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    const booksWithUserStatus = books.map(book => {
      const bookId = book._id;
      return {
        ...book._doc,
        isInCart: user.cart.includes(bookId),
        isInMybooks: user.mybooks.includes(bookId),
        isInWishlist: user.wishlist.includes(bookId),
      };
    });

    res.status(200).json({ Result: true, Data: booksWithUserStatus });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for books." });
  }
};

const handleGetMyBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("mybooks");

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
    const user = await User.findById(req.user.id).populate("wishlist");

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
    const user = await User.findById(req.user.id).populate("cart");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ Result: true, Data: user.cart });
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

  if (req.user.id) {
    try {
      const purchase = new Purchase({
        userId: req.user.id,
        items,
        totalAmount,
      });
      const result = await purchase.save();

      const bookIds = items.map((item) => item.bookId);
      await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { mybooks: { $each: bookIds } } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { cart: [] } },
      );

      res.status(201).json({
        Result: true,
        Data: "Purchase successful and books added to user library",
        OrderId: result._id
      });
    } catch (error) {
      console.log(error)
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

const handleGetMyPurchaseData = async (req, res) => {
  try {
    const purchase = await Purchase.find({userId:req.user.id}).sort({paymentDate:-1}).populate("items.bookId").exec();

    if (!purchase) {
      return res.status(404).json({ error: "No Purchase found." });
    }

    res.status(200).json({ Result: true, Data: purchase });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the purchase." });
  }
}

const handleBookStream = async (req, res) => {
  const {bookId} = req.params;
  console.log("getting book",bookId)
  try {
    const book = await Book.findById(bookId);
    console.log(book)
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const pdfPath = book.bookurl;
    res.setHeader("Content-Type", "application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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
  handleClearCart,
  handleAddToMyBook,
  handleGetMyDetails,
  handleUpdateMyDetails,
  handleSearchBook,
  handleGetMyBooks,
  handleGetMyWishlist,
  handleGetMyCart,
  handlePurchaseBook,
  handleGetMyPurchaseData,
  handleBookStream,
};
