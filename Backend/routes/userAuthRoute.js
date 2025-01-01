import express from 'express'
import { handleLogin, handleLogout, handleNewUser, handleRefreshToken, requestPasswordReset, resetPassword } from '../controllers/userAuthController.js';

const userAuthRouter = express.Router();

userAuthRouter.post("/signin", handleNewUser);
userAuthRouter.post("/login", handleLogin);
userAuthRouter.post("/logout",handleLogout);
userAuthRouter.post("/refreshtoken", handleRefreshToken);
userAuthRouter.post("/request-password-reset", requestPasswordReset);
userAuthRouter.post("/reset-password", resetPassword);

export default userAuthRouter;