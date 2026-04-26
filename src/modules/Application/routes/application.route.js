import { Router } from 'express';
import * as controller from '../controllers/application.controller.js';
import { isAuthenticated } from '../../../middlewares/auth.middleware.js';
import { restrictTo } from '../../../middlewares/auth.middleware.js';
import { roles } from '../../../middlewares/roles.middleware.js';
import {validate} from '../../../middlewares/validationMiddleware.js';
import {
  createApplicationValidation,
  updateApplicationStatusValidation,
  applicationIdParamValidation
} from '../validations/application.validation.js';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  validate(createApplicationValidation),
  controller.createApplication
);

router.get('/my', isAuthenticated, restrictTo('User'), controller.getUserApplications);
router.get(
  '/job/:id',
  isAuthenticated,
  restrictTo('HR', 'OWNER'),
  controller.getJobApplications
);

//Update application status (HR/Owner)
router.patch(
  '/status/:id',
  isAuthenticated,
  restrictTo('HR', 'OWNER'),
  validate(updateApplicationStatusValidation),
  controller.updateApplicationStatus
);

//Delete application (User only)
router.delete(
  '/:id',
  isAuthenticated,
  restrictTo('User'),
  validate(applicationIdParamValidation),
  controller.deleteApplication
);

export default router;
