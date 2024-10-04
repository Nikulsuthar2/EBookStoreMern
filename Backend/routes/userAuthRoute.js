import express from 'express'
import { handleLogin, handleLogout, handleNewUser, handleRefreshToken } from '../controllers/userAuthController.js';

const userAuthRouter = express.Router();

userAuthRouter.post("/signin", handleNewUser);
userAuthRouter.post("/login", handleLogin);
userAuthRouter.post("/logout",handleLogout);
userAuthRouter.post("/refreshtoken", handleRefreshToken);

export default userAuthRouter;