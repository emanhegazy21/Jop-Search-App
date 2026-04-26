import express from "express";
import * as userController from "../controllers/user.controller.js";
import { uploadSingleImage } from "../../../middlewares/upload.middleware.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { validateRequest, validate } from "../../../middlewares/validationMiddleware.js";
import {
  updateUserValidation,
  updatePasswordValidation,
  getProfileValidation,
} from "../validations/user.validation.js";

const router = express.Router();

router.put("/update", isAuthenticated, validateRequest(updateUserValidation), userController.updateAccount);
router.get("/me", isAuthenticated, userController.getMyAccount);
router.get("/profile/:userId", validate(getProfileValidation, "params"), userController.getUserProfile);
router.put("/update-password", isAuthenticated, validateRequest(updatePasswordValidation), userController.updatePassword);

// Upload profile picture
router.patch(
  "/upload-profile-picture",
  isAuthenticated,
  uploadSingleImage("image", "user/profile"),
  userController.uploadProfilePicture
);

// Upload cover picture
router.patch(
  "/upload-cover-picture",
  isAuthenticated,
  uploadSingleImage("image", "user/cover"),
  userController.uploadCoverPicture
);

router.patch("/delete-profile-picture", isAuthenticated, userController.deleteProfilePicture);
router.patch("/delete-cover-picture", isAuthenticated, userController.deleteCoverPicture);

export default router;
