import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
  code: String,
  type: { type: String, enum: ["confirmEmail", "forgetPassword"] },
  expiresIn: Date,
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, enum: ["google", "system"], default: "system" },
    gender: { type: String, enum: ["Male", "Female"] },

    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          const ageDiff = Date.now() - value.getTime();
          const age = ageDiff / (1000 * 60 * 60 * 24 * 365.25);
          return age >= 18;
        },
        message: "User must be at least 18 years old",
      },
    },

    mobileNumber: { type: String },

    role: { type: String, enum: ["user", "admin" , "owner", "hr"], default: "user" },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Date },
    bannedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },

   profilePic: {
  type: String,
  default: null,
},
coverPic: {
  type: String,
  default: null,
},
    OTP: [otpSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field: username
userSchema.virtual("username").get(function () {
  return `${this.firstName}${this.lastName}`;
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// 🔐 Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
const User = mongoose.model("User", userSchema);
export default User;

