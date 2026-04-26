// job.model.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: [true, "Job location is required"],
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: [true, "Working time is required"],
    },
    seniorityLevel: {
      type: String,
      enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: [true, "Seniority level is required"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    technicalSkills: {
      type: [String],
      required: [true, "Technical skills are required"],
    },
    softSkills: {
      type: [String],
      required: [true, "Soft skills are required"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobSchema.virtual("applications", {
  ref: "Application",
  foreignField: "jobId",
  localField: "_id",
});

export const Job = mongoose.model("Job", jobSchema);
