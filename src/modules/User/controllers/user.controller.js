import User from "../../../modules/User/models/user.model.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { AppError , catchAsync } from "../../../utils/errorHandling.js";

export const updateAccount = catchAsync(async (req, res) => {
  const allowedFields = ["firstName", "lastName", "gender", "DOB", "mobileNumber"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.status(200).json({ message: "Account updated", user: updatedUser });
});

export const getMyAccount = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);
  
  res.status(200).json({ user });
});

export const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("firstName lastName mobileNumber profilePic coverPic")
    .lean();
  
  if (!user) throw new AppError("User not found", 404);

  const username = `${user.firstName}${user.lastName}`;
  res.status(200).json({
    userName: username,
    mobileNumber: user.mobileNumber,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new AppError("Current password incorrect", 400);

  //Hash the new password before saving
  user.password = await bcrypt.hash(newPassword, 12);
  user.changeCredentialTime = new Date();
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

export const uploadProfilePicture = catchAsync(async (req, res) => {
  const imagePath = `${req.folder}/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: imagePath },
    { new: true }
  );
  res.status(200).json({ message: "Profile picture uploaded", profilePic: user.profilePic });
});

export const uploadCoverPicture = catchAsync(async (req, res) => {
  const imagePath = `${req.folder}/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverPic: imagePath },
    { new: true }
  );
  res.status(200).json({ message: "Cover picture uploaded", coverPic: user.coverPic });
});

export const deleteProfilePicture = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.profilePic) {
    fs.unlinkSync(`uploads/${user.profilePic}`);
    user.profilePic = null;
    await user.save();
    res.status(200).json({ message: "Profile picture deleted" });
  } else {
    res.status(400).json({ message: "No profile picture to delete" });
  }
});


export const deleteCoverPicture = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.coverPic) {
    fs.unlinkSync(`uploads/${user.coverPic}`);
    user.coverPic = null;
    await user.save();
    res.status(200).json({ message: "Cover picture deleted" });
  } else {
    res.status(400).json({ message: "No cover picture to delete" });
  }
});

export const softDeleteAccount = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { deletedAt: new Date() });
  res.status(200).json({ message: "Account soft deleted" });
};
