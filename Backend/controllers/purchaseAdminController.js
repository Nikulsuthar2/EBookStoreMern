import Purchase from "../models/purchaseSchema.js";

const handleGetAllPurchases = async (req, res) => {
  if (req.user.role == 1) {
    try {
      const purchases = await Purchase.find()
        .populate("userId", "name email")
        .populate("items.bookId", "title thumbnail")
        .sort({ paymentDate: -1 });
      res.status(200).json({ Result: true, Data: purchases });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch purchases" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleGetMonthlyPurchase = async (req, res) => {
  if (req.user.role == 1) {
    const { year, month } = req.params;
    try {
      const monthlyPurchases = await Purchase.find({
        paymentDate: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      })
        .populate("userId", "name email")
        .populate("items.bookId", "title thumbnail").sort({ paymentDate: -1 });

      res.status(200).json({ Result: true, Data: monthlyPurchases });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch monthly purchases" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleGetYearlyPurchase = async (req, res) => {
  if (req.user.role == 1) {
    const { year } = req.params;
    try {
      const yearlyPurchases = await Purchase.find({
        paymentDate: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
        },
      })
        .populate("userId", "name email") // Populate user info if needed
        .populate("items.bookId", "title").sort({ paymentDate: -1 }); // Populate book details

      res.status(200).json({ Result: true, Data: yearlyPurchases });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch yearly purchases" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleBookWisePurchase = async (req, res) => {
  if (req.user.role == 1) {
    try {
      const productWiseEarnings = await Purchase.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.bookId",
            totalAmount: { $sum: "$items.price" },
            salesCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" },
        { $sort: { totalAmount: -1 } },
        {
          $project: {
            _id: 0,
            bookId: "$bookDetails._id",
            thumbnail: "$bookDetails.thumbnail",
            bookTitle: "$bookDetails.title",
            price: "$bookDetails.price",
            totalAmount: 1,
            salesCount: 1,
          },
        },
      ]);
      res.status(200).json({ Result: true, Data: productWiseEarnings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product-wise earnings" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleBookWiseMonthlyPurchase = async (req, res) => {
  const { month, year } = req.params;
  if (req.user.role == 1) {
    try {
      const productWiseEarnings = await Purchase.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.bookId",
            totalAmount: { $sum: "$items.price" },
            salesCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" },
        { $sort: { totalAmount: -1 } },
        {
          $project: {
            _id: 0,
            bookId: "$bookDetails._id",
            thumbnail: "$bookDetails.thumbnail",
            bookTitle: "$bookDetails.title",
            price: "$bookDetails.price",
            totalAmount: 1,
            salesCount: 1,
          },
        },
      ]);
      res.status(200).json({ Result: true, Data: productWiseEarnings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product-wise earnings" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleBookWiseYearlyPurchase = async (req, res) => {
  const { year } = req.params;
  if (req.user.role == 1) {
    try {
      const productWiseEarnings = await Purchase.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
            },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.bookId",
            totalAmount: { $sum: "$items.price" },
            salesCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" },
        { $sort: { totalAmount: -1 } },
        {
          $project: {
            _id: 0,
            bookId: "$bookDetails._id",
            thumbnail: "$bookDetails.thumbnail",
            bookTitle: "$bookDetails.title",
            price: "$bookDetails.price",
            totalAmount: 1,
            salesCount: 1,
          },
        },
      ]);
      res.status(200).json({ Result: true, Data: productWiseEarnings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product-wise earnings" });
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

export {
  handleGetAllPurchases,
  handleGetMonthlyPurchase,
  handleGetYearlyPurchase,
  handleBookWisePurchase,
  handleBookWiseMonthlyPurchase,
  handleBookWiseYearlyPurchase,
};
