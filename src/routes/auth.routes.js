import express from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { registerController, verifyEmailController,emailResendController,loginController,getMe,forgotPassword,resetPasswordController,logoutController } from "../controllers/auth.controller.js";
import authUser from "../middlewares/authuser.middleware.js";

export const AuthRouter = express.Router();

AuthRouter.post("/register",registerValidator,registerController)
AuthRouter.post("/login",loginController)
AuthRouter.get("/verify-email",verifyEmailController)
AuthRouter.post("/resend-email",emailResendController)
AuthRouter.get("/get-user",authUser,getMe)
AuthRouter.post("/logout",authUser,logoutController)
AuthRouter.post("/forgot-password",forgotPassword)
AuthRouter.post("/reset-password",resetPasswordController)

