import User from "../../User/models/user.model.js";
import { AppError, catchAsync } from "../../../utils/errorHandling.js";
import { sendOTP, hashOTP, verifyOTP } from "../../../utils/otp.js";
import {generateTokens} from "../../../utils/jwtHelper.js";
import bcrypt from "bcrypt";

//Sign Up
export const signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, mobileNumber, gender, DOB } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("Email already in use", 400));

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    gender,
    DOB,
    provider: "system",
  });

  const code = await sendOTP(email, "confirmEmail");
  user.OTP.push({ code: hashOTP(code), type: "confirmEmail", expiresIn: Date.now() + 10 * 60 * 1000 });
  await user.save();

  res.status(201).json({ status: "success", message: "Check your email for OTP" });
});


export const confirmEmailOTP = catchAsync(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  const otpRecord = user.OTP.find(
    (otp) => otp.type === "confirmEmail" && otp.expiresIn > Date.now()
  );
  if (!otpRecord) return next(new AppError("OTP expired or invalid", 400));

  const isValid = await verifyOTP(code, otpRecord.code);
  if (!isValid) return next(new AppError("Incorrect OTP", 400));

  user.isConfirmed = true;
  user.OTP = user.OTP.filter((otp) => otp.type !== "confirmEmail");
  await user.save();

  res.status(200).json({ status: "success", message: "Email confirmed" });
});

//login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid credentials", 400));
  }

  if (user.provider !== "system") {
    return next(new AppError("Use social login method", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 400));
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
  });
});

//Send OTP for forget password
export const sendForgetPasswordOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  const code = await sendOTP(email, "forgetPassword");
  user.OTP.push({ code: hashOTP(code), type: "forgetPassword", expiresIn: Date.now() + 10 * 60 * 1000 });
  await user.save();

  res.status(200).json({ status: "success", message: "OTP sent to email" });
});

//Reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  const otpRecord = user.OTP.find(
    (otp) => otp.type === "forgetPassword" && otp.expiresIn > Date.now()
  );
 if (!code || !otpRecord?.code) {
  return next(new AppError("OTP code is missing or invalid", 400));
}
  const isValid = await verifyOTP(code, otpRecord.code);
  if (!isValid) return next(new AppError("Incorrect OTP", 400));

  user.password = await bcrypt.hash(newPassword, 12);
  user.changeCredentialTime = Date.now();
  user.OTP = user.OTP.filter((otp) => otp.type !== "forgetPassword");
  await user.save();

  res.status(200).json({ status: "success", message: "Password reset successful" });
});

//Refresh token
export const refreshToken = catchAsync(async (req, res, next) => {
  const { user } = req;
  if (!user) return next(new AppError("User not found", 401));

  const { accessToken , refreshToken} = generateTokens(user);
  res.status(200).json({ status: "success", accessToken , refreshToken });
});
