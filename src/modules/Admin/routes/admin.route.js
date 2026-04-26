import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { isAuthenticated, restrictTo } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/user/:userId/ban", isAuthenticated, restrictTo('admin'), adminController.banOrUnbanUser);
router.patch("/company/:companyId/ban", isAuthenticated, restrictTo('admin'), adminController.banOrUnbanCompany);
router.patch("/company/:companyId/approve", isAuthenticated, restrictTo('admin'), adminController.approveCompany);

export default router;