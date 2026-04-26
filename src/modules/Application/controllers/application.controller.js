
import { Application } from '../models/application.model.js';
import { catchAsync,AppError } from '../../../utils/errorHandling.js';
import { Job } from '../../Jobs/models/job.model.js';

//Create new application
export const createApplication = catchAsync(async (req, res) => {
  const { jobId, userCV } = req.body;
  const userId = req.user._id;

  const existing = await Application.findOne({ jobId, userId });
  if (existing) throw new AppError("You already applied for this job", 400);

  const application = await Application.create({ jobId, userId, userCV });
  res.status(201).json({ message: 'Application created', application });
});

// Get all applications by user (for user dashboard)
export const getUserApplications = catchAsync (async (req, res) => {
  const userId = req.user._id;
  const apps = await Application.find({ userId }).populate('jobId');
  res.status(200).json({ count: apps.length, applications: apps });
});

// Get all applications for a specific job (for HR / owner)
export const getJobApplications = catchAsync(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);
  if (!job) throw new AppError("Job not found", 404);

  const apps = await Application.find({ jobId }).populate('userId');
  res.status(200).json({ count: apps.length, applications: apps });
});

export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const app = await Application.findById(id);
  if (!app) throw new ApiError("Application not found", 404);

  app.status = status;
  await app.save();

  res.status(200).json({ message: 'Application status updated', application: app });
});

//Delete application (Soft delete - user only)
export const deleteApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const app = await Application.findById(id);
  if (!app) throw new AppError("Application not found", 404);

  if (app.userId.toString() !== req.user._id.toString()) {
    throw new ApiError("Not authorized", 403);
  }

  await app.deleteOne();
  res.status(200).json({ message: 'Application deleted' });
});
