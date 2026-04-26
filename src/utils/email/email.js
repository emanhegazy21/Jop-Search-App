import nodemailer from "nodemailer";
import { AppError } from "../errorHandling.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 General Email Sender
export const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Job Search App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new AppError("Failed to send email", 500);
  }
};

// OTP Email Sender
export const sendOtpEmail = async (email, otp) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Hi 👋</p>
        <p>Your OTP code is:</p>
        <h2 style="color: #007bff;">${otp}</h2>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>Thanks,<br>Job Search App Team</p>
      </div>
    `;
    await transporter.sendMail({
      from: `"Job Search App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: htmlContent,
    });
    console.log(`✅ OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send OTP:", error.message);
    throw new AppError("Failed to send OTP email", 500);
  }
};