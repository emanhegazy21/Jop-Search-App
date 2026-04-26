import { Company } from '../models/company.model.js';
import { Job } from '../../Jobs/models/job.model.js';
import { AppError, catchAsync } from '../../../utils/errorHandling.js';


export const addCompany = catchAsync(async (req, res, next) => {
  const { companyEmail, companyName } = req.body;

  const emailExists = await Company.findOne({ companyEmail });
  const nameExists = await Company.findOne({ companyName });
  if (emailExists || nameExists) return next(new AppError("Email or name already exists", 409));

  req.body.createdBy = req.user._id;
  const company = await Company.create(req.body);
  res.status(201).json({ message: "Company added successfully", company });
});


export const updateCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (!company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));

  delete req.body.legalAttachment;
  const updated = await Company.findByIdAndUpdate(req.params.companyId, req.body, { new: true });
  res.status(200).json({ message: "Company updated", updated });
});


export const softDeleteCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (req.user.role !== 'admin' && !company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));

  company.deletedAt = new Date();
  await company.save();
  res.status(200).json({ message: "Company soft deleted" });
});


export const getCompanyWithJobs = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId).populate("jobs");
  if (!company) return next(new AppError("Company not found", 404));
  res.status(200).json({ company });
});


export const searchCompanyByName = catchAsync(async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ message: "Name query is required" });
  const companies = await Company.find({ companyName: { $regex: name, $options: 'i' } });
  res.status(200).json({ companies });
});

export const uploadCompanyLogo = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (!company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));
  if (!req.file) return next(new AppError("No file uploaded", 400));

  company.logo = {
    secure_url: `${req.folder}/${req.file.filename}`,
    public_id: req.file.filename,
  };
  await company.save();
  res.status(200).json({ message: "Logo uploaded", logo: company.logo });
});


export const uploadCompanyCoverPic = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (!company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));
  if (!req.file) return next(new AppError("No file uploaded", 400));

  company.coverPic = {
    secure_url: `${req.folder}/${req.file.filename}`,
    public_id: req.file.filename,
  };
  await company.save();
  res.status(200).json({ message: "Cover picture uploaded", coverPic: company.coverPic });
});


export const deleteCompanyLogo = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (!company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));

  company.logo = null;
  await company.save();
  res.status(200).json({ message: "Logo deleted" });
});


export const deleteCompanyCoverPic = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company) return next(new AppError("Company not found", 404));
  if (!company.createdBy.equals(req.user._id)) return next(new AppError("Unauthorized", 403));

  company.coverPic = null;
  await company.save();
  res.status(200).json({ message: "Cover picture deleted" });
});