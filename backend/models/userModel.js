const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name"],
      maxLength: [30, " Name cannot exceed 30 characters"],
      minlength: [4, "Name should have more than 4 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
      minlength: [8, "Password length should be minimum 8 characters"],
    },
    avatar: {
      public_id: {
        type: String,
        required: [true],
      },
      public_url: {
        type: String,
        required: [true],
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    userLoggedInDetails: {
      select: false,
      lastLogin: {
        // ! check here for number
        type: Date,
        required: true,
      },
      currentlyLoggedIn: {
        type: Boolean,
        required: true,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // ? kitna strong password uttna jitna jayada badi value uttna secure password but more secure more power consumption and time

  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// ? generate JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ? compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ? generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding to user Schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set expire for token
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // ? to convert it into millisecond

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
