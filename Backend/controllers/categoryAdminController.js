import Category from "../models/categorySchema.js";

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
    const { catId } = req.params;
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
  handleAddCategory,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
