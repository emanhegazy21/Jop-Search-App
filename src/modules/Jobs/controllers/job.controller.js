import { Job } from "../models/job.model.js";
import { AppError, catchAsync } from "../../../utils/errorHandling.js";

export const addJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create({
    ...req.body,
    addedBy: req.user._id,
  });
  res.status(201).json({ 
    status: "success", 
    data: { job: newJob } 
  });
});

export const updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new AppError("Job not found", 404));

  if (job.addedBy.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to update this job", 403));
  }

  Object.assign(job, req.body);
  job.updatedBy = req.user._id;
  await job.save();
  res.status(200).json({ status: "success", data: job });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId).populate("companyId");
  if (!job) return next(new AppError("Job not found", 404));

  const isOwner = job.addedBy.toString() === req.user._id.toString();
  const isHR = job.companyId.hr && job.companyId.hr.includes(req.user._id);

  if (!isOwner && !isHR) {
    return next(new AppError("Unauthorized to delete this job", 403));
  }

  await job.deleteOne();
  res.status(204).json({ status: "success", data: null });
});

export const getAllJobs = catchAsync(async (req, res) => {
  const jobs = await Job.find().populate("companyId");
  res.status(200).json({ status: "success", results: jobs.length, data: jobs });
});

export const getFilteredJobs = catchAsync(async (req, res, next) => {
  const { address, companyName, ...otherFilters } = req.query;
  const jobs = await Job.find(otherFilters).populate("companyId");
  if (address || companyName) {
    jobs = jobs.filter((job) => {
      let match = true;
      
      if (address) {
        const addr = job.companyId?.address?.toLowerCase() || "";
        match = match && addr.includes(address.toLowerCase());
      }
      if (companyName) {
        const name = job.companyId?.companyName?.toLowerCase() || "";
        match = match && name.includes(companyName.toLowerCase());
      }
      return match;
    });
  }
  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: jobs,
  });
});
export const getSingleJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId).populate("companyId applications");
  if (!job) return next(new AppError("Job not found", 404));
  res.status(200).json({ status: "success", data: job });
});

export const applyJob = catchAsync(async (req, res, next) => {
  const { Application } = await import("../../Application/models/application.model.js");

  if (!req.file) {
    return next(new AppError("Please upload your CV", 400));
  }
  const existingApp = await Application.findOne({ 
    jobId: req.params.jobId, 
    userId: req.user._id 
  });
  
  if (existingApp) return next(new AppError("Already applied to this job", 400));

  const application = await Application.create({ 
    jobId: req.params.jobId, 
    userId: req.user._id,
    userCV: {
      secure_url: req.file.path,  
      public_id: req.file.filename   
    }
  });

  res.status(201).json({ status: "success", data: application });
});
export const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { Application } = await import("../../Application/models/application.model.js");

  const application = await Application.findById(req.params.applicationId).populate("jobId");
  if (!application) return next(new AppError("Application not found", 404));

  const job = await Job.findById(application.jobId._id).populate("companyId");
  if (!job || !job.companyId.hr.includes(req.user._id)) {
    return next(new AppError("Unauthorized to change status", 403));
  }

  application.status = req.body.status;
  await application.save();
  res.status(200).json({ status: "success", data: application });
});