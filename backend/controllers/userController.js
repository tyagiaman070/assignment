const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// * Register a user --all
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  if (!avatar) {
    return res.status(404).json({
      success: false,
      message: "Please Select a profile picture",
    });
  }

  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const userLoggedInDetails = {
    lastLogin: Date.now(),
    currentlyLoggedIn: true,
  };
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      public_url: myCloud.secure_url,
    },
    userLoggedInDetails,
  });

  delete user["password"];

  sendToken(user, 201, res);
});

// * user login --all
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // ? validation check
  if (!email || !password) {
    next(new ErrorHandler("Please Enter email and password", 400));
  }

  const user = await User.findOne({
    email,
  }).select("+password"); // ? top get the password also as it will be not selected by default

  if (!user) {
    return next(new ErrorHandler(`No user Exist with ${email} email`, 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  user.userLoggedInDetails = {
    lastLogin: Date.now(),
    currentlyLoggedIn: true,
  };

  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
});

// ? logout --loggedIn
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  user.userLoggedInDetails.currentlyLoggedIn = false;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Logout success",
  });
});

// * Forgot password --all
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ? Get reset password token
  const resetToken = user.getResetPasswordToken();

  // ? user ka jo reset pass token ha vo baas generate hua ha upper vala method sa first we need to save that data hence we do it below
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;

  const message = `Your Password Reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email please take appropriate actions to safe your account`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Product Store Reset Password Email`,
      message,
    });

    user.userLoggedInDetails.currentlyLoggedIn = false;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Reset Password email sent to ${user.email} successfully`,
    });
  } catch (error) {
    //? if any errors comes then user should again req for reset password link
    user.ResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// * Reset Password --all
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash to match it which exist in DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // ? to get the expire time greater than current time
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password doesn't match", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// ? get My Details --loggedIn
exports.getMyDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    success: true,
    user,
  });
});

// ? Update My Profile --loggedIn
exports.updateMyProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "" && req.body.avatar !== undefined) {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      public_url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// ? Get Single user --loggedIn
exports.getAUserWithEmail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    return next(
      new ErrorHandler(
        `User doesn't exist with this email: ${req.params.email}`
      )
    );
  }

  if (req.user.role === "user" && user.role === "admin") {
    res.status(200).json({
      success: false,
      message: `User doesn't exist with this email ${req.params.email}`,
    });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ! Get all users --admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  var filterArray = [];

  for (let i = 0; i < users.length; i++) {
    if (JSON.stringify(users[i]._id) !== JSON.stringify(req.user._id)) {
      filterArray.push(users[i]);
    }
  }

  res.status(200).json({
    success: true,
    users: filterArray,
  });
});

// ! delete user --admin
exports.deleteAUser = catchAsyncErrors(async (req, res, next) => {
  // ? Later delete the avatar/image/profile picture remove cloudinary

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ? delete my account --loggedIn
exports.deleteMe = catchAsyncErrors(async (req, res, next) => {
  const user = User.findById(req.user.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id ${req.user.id}`, 400)
    );
  }

  await user.remove();

  // to Clean cookie stuff
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
