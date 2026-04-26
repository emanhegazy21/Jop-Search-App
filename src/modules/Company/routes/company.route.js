import { Router } from "express";
import * as companyController from "../controllers/company.controller.js";
import { isAuthenticated, restrictTo} from "../../../middlewares/auth.middleware.js";
import  {validate} from "../../../middlewares/validationMiddleware.js";
import {
  addCompanySchema,
  updateCompanySchema,
  searchCompanySchema,
} from "../validations/company.validation.js";
import {uploadSingleImage} from "../../../middlewares/upload.middleware.js";
import { roles } from "../../../middlewares/roles.middleware.js";

const router = Router();

//Add company
router.post(
  "/",
  isAuthenticated, restrictTo("User"),
  validate(addCompanySchema),
  companyController.addCompany
);

//Update company
router.put(
  "/:companyId",
  isAuthenticated,restrictTo("User"),
  validate(updateCompanySchema),
  companyController.updateCompany
);

//Soft delete company
router.delete("/:companyId", isAuthenticated,restrictTo (roles.User, roles.Admin), companyController.softDeleteCompany);

//Get company with jobs
router.get("/:companyId", companyController.getCompanyWithJobs);

//Search for company
router.get("/", validate(searchCompanySchema), companyController.searchCompanyByName);

//Upload company logo
router.post(
  "/logo/:companyId",
  isAuthenticated ,restrictTo("User"),
  uploadSingleImage("logo","companies"),
  companyController.uploadCompanyLogo
);

//Upload company cover pic
router.post(
  "/coverPic/:companyId",
  isAuthenticated ,restrictTo("User"),
  uploadSingleImage("coverPic","companies"),
  companyController.uploadCompanyCoverPic
);

//Delete company logo
router.delete("/logo/:companyId", isAuthenticated,restrictTo(roles.User),companyController.deleteCompanyLogo);

//Delete company cover pic
router.delete("/coverPic/:companyId", isAuthenticated,restrictTo(roles.User), companyController.deleteCompanyCoverPic);

export default router;
