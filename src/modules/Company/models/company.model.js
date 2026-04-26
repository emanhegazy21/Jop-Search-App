import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const rangeRegex = /^\d{1,}-\d{1,}$/;

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Company description is required"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    numberOfEmployees: {
      type: String,
      required: [true, "Employee range is required"],
      validate: {
        validator: function (v) {
          return rangeRegex.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid employee range. Example: 11-20`,
      },
    },
    companyEmail: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    logo: {
      type: logoSchema,
      default: null,
    },
    coverPic: {
      type: logoSchema,
      default: null,
    },
    legalAttachment: {
      type: logoSchema,
      required: [true, "Legal attachment is required"],
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: Date,
    deletedAt: Date,
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.virtual("jobs", {
  ref: "Job",
  foreignField: "companyId",
  localField: "_id",
});

export const Company = mongoose.model("Company", companySchema);