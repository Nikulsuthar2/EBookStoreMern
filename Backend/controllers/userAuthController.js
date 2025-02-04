import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import sendEmail from "../config/mail.js";

const handleNewUser = async (req, res) => {
  const { email, name, pswd, role } = req.body;
  if (!name || !email || !pswd)
    return res
      .status(400)
      .json({ Result: false, Data: "Name, email and password are required" });

  //check for already exist
  const duplicate = await User.findOne({ email:email.toLowerCase() }).exec();
  if (duplicate)
    return res.status(409).json({ Result: false, Data: "Email already exist" }); //conflict

  try {
    // encrypt the password
    const hashedPWD = await bcrypt.hash(pswd, 10);

    // store new user
    const newUser = {
      name: name,
      email: email.toLowerCase(),
      password: hashedPWD,
      role: role ?? 0,
    };

    const result = await User.create(newUser);
    await result.save();

    sendEmail(
      email,
      "Welcome to E-Book Store 📚",
      `
        Welcome, ${name}!
        Thank you for registering with E-Book Store. We're excited to have you join our community of book lovers.
        Explore our collection of books and enjoy exclusive deals just for you.
        Happy Reading! 📖
        
        Best Regards,The E-Book Store Team
      `,
      `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for registering with <strong>E-Book Store</strong>. We're excited to have you join our community of book lovers.</p>
        <p>Explore our collection of books and enjoy exclusive deals just for you.</p>
        <p>Happy Reading! 📖</p>
        <br>
        <p>Best Regards,<br>The E-Book Store Team</p>
      `
    );
    res.status(201).json({ Result: true, Data: "New User Created" }); //"token":accessToken
  } catch (err) {
    console.log(err);
    res.status(500).json({ Result: false, Data: err.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, pswd } = req.body;
  if (!email || !pswd)
    return res
      .status(400)
      .json({ Result: false, Data: "Email and password are required" });

  const foundUser = await User.findOne({ email:email.toLowerCase() }).exec();
  if (!foundUser)
    return res.status(401).json({ Result: false, Data: "User not exist" });

  const match = await bcrypt.compare(pswd, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          username: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );
    const refreshToken = jwt.sign(
      { name: foundUser.name, id: foundUser._id, email: foundUser.email, role: foundUser.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refresh token with current user
    foundUser.refreshToken = refreshToken;

    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      Result: true,
      token: accessToken,
      Data: `User ${foundUser.name} is logged in`,
    });
  } else {
    res
      .status(401)
      .json({ Result: false, Data: "Username or password are incorrect" });
  }
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(204)
      .json({ Data: "No jwt cookie found so Unauthorized" });
  const refreshToken1 = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken: refreshToken1 }).exec();
  if (!foundUser) return res.sendStatus(403); //forbidden
  jwt.verify(
    refreshToken1,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.name !== decoded.name) return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3600s" }
      );
      res.json({ accessToken });
    }
  );
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken1 = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken: refreshToken1 }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  foundUser.status = false;
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({Result:false, Data: "User not found." });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token and expiry in the database
    user.resetToken = {
      token: resetToken,
      expiresAt: Date.now() + 1000 * 60 * 10, // Token valid for 15 minutes
    };
    await user.save();

    // Send email with reset link
    const resetLink = `${process.env.ORIGIN}resetpassword/${resetToken}`;
    sendEmail(
      email,
      "Password Reset Request",
      `Password Reset Request
      Click the link below to reset your password. The link is valid for 10 minutes.
      ${resetLink}`,
      `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password. The link is valid for 10 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
    `
    );

    res
      .status(200)
      .json({ Result:true, Data: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Result:false, Data: "Error requesting password reset." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({
      "resetToken.token": token,
      "resetToken.expiresAt": { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ Result:false, Data: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();
    sendEmail(
      user.email,
      "Password Reset Successful",
      "Your password has been reset successfully.",
      `
      <h1>Password Reset Successful</h1>
      <p>Your password has been reset successfully.</p>
    `
    );
    res.status(200).json({Result:true, Data: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({Result:false, Data: "Error resetting password." });
  }
};

export {
  handleNewUser,
  handleLogin,
  handleRefreshToken,
  handleLogout,
  requestPasswordReset,
  resetPassword
};
