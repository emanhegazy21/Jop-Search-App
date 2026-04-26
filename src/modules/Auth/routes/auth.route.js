import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { validateRequest } from "../../../middlewares/validationMiddleware.js";
import { 
  signupSchema, 
  loginSchema, 
  confirmOTPSchema, 
  forgetPasswordSchema, 
  resetPasswordSchema 
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/confirm-otp", validateRequest(confirmOTPSchema), authController.confirmEmailOTP);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/forget-password", validateRequest(forgetPasswordSchema), authController.sendForgetPasswordOTP);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);
router.post("/refresh-token", isAuthenticated, authController.refreshToken);

export default router;