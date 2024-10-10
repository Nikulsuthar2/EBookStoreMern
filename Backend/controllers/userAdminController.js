import User from "../models/userSchema.js";

const handleGetUserList = async (req, res) => {
  if (req.user.role) {
    try {
      const foundUser = await User.find().sort({ name: 1 }).exec();
      res.status(200).json({ Result: true, Data: foundUser });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

const handleDeleteUser = async (req, res) => {
  const {id} = req.params;
  if (req.user.role) {
    try {
      const foundUser = await User.find({_id:id}).exec();
      if(!foundUser) return res.status(404).json({ Result: false, Data: "User Not Found" });

      await User.findByIdAndDelete(id).exec();
      res.status(200).json({ Result: true, Data: `${foundUser.name} is Deleted` });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).json({ Result: false, Data: "Not Authorized" });
  }
};

export { handleGetUserList, handleDeleteUser };
