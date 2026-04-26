import crypto from "crypto";
import { sendOtpEmail } from "./email/email.js";

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// Hash the OTP
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
// Verify a hashed OTP
export const verifyOTP = (rawCode, hashedCode) => {
  const hashedInput = hashOTP(rawCode);
  return hashedInput === hashedCode;
};

export const sendOTP = async (email, type) => {
  const code = generateOTP();
  await sendOtpEmail(email, code); 
  return code;
};