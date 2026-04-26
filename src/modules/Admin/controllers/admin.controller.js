import User from "../../User/models/user.model.js";
import { Company } from "../../Company/models/company.model.js";

export const banOrUnbanUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.bannedAt = user.bannedAt ? null : new Date();
  await user.save();
  res
    .status(200)
    .json({ message: user.bannedAt ? "User banned" : "User unbanned" });
};

export const banOrUnbanCompany = async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "Company not found" });

  company.bannedAt = company.bannedAt ? null : new Date();
  await company.save();
  res
    .status(200)
    .json({
      message: company.bannedAt ? "Company banned" : "Company unbanned",
    });
};

export const approveCompany = async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "Company not found" });

  company.approvedByAdmin = true;
  await company.save();
  res.status(200).json({ message: "Company approved" });
};
