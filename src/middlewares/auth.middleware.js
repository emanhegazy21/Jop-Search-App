import jwt from "jsonwebtoken";
import User from "../modules/User/models/user.model.js";
import { AppError } from "../utils/errorHandling.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new AppError("You are not logged in", 401));
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return next(new AppError("User not found or deleted", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log("User Role from DB:", req.user.role);
    console.log("Allowed Roles for this route:", roles);

    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `You are ${req.user.role}, but this route requires: ${roles}`,
          403,
        ),
      );
    }
    next();
  };
};
