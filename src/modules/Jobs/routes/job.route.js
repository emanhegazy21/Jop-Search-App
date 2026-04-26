import express from "express";
import * as jobController from "../controllers/job.controller.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validations/job.validation.js";
import { validate } from "../../../middlewares/validationMiddleware.js";
import { isAuthenticated, restrictTo } from "../../../middlewares/auth.middleware.js";
import { uploadSingleFile } from "../../../middlewares/upload.middleware.js";

const router = express.Router();


router.use(isAuthenticated);


router.get("/", jobController.getAllJobs);
router.get("/filter", jobController.getFilteredJobs);
router.get("/:jobId", jobController.getSingleJob);


router.post("/:jobId/apply", restrictTo("User"), uploadSingleFile("cv", "cvs"), jobController.applyJob);
router.post(
  "/",
  restrictTo("CompanyOwner", "HR"),
  validate(createJobSchema),
  jobController.addJob
);

router.patch(
  "/:jobId",
  restrictTo("CompanyOwner"),
  validate(updateJobSchema),
  jobController.updateJob
);

router.delete(
  "/:jobId",
  restrictTo("CompanyOwner", "HR"),
  jobController.deleteJob
);

// Application status update (HR/Owner only)
router.patch(
  "/application/:applicationId",
  restrictTo("CompanyOwner", "HR"),
  jobController.updateApplicationStatus
);

export default router;
