const doctorModel = require('../models/Doctors');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utilies/apiFeatures');
const cloudinary = require("cloudinary");
const SendEmail = require('../utilies/sendEmail');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
 const sendToken = require('../utilies/jwtToken');
const sendDoctorToken = require('../utilies/jwtToken');
const ErrorHandler = require('../utilies/ErrorHandler');
const crypto = require("crypto");

exports.createDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, name, gender, birthdate, district, nid_No, bmdc_No, type, phone, email, password, work, expert, degree, experience, fees } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    const findDoctor = await doctorModel.findOne({ email: email });
    if (findDoctor) {
      return next(new ErrorHandler("doctor already exists", 400));
    }
    const doctor = await doctorModel.create({
      title, name, gender, birthdate, district, nid_No, bmdc_No, type,
      phone, email, password, work, expert, degree, experience, fees,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    // sendToken(doctor, 201, res);
    sendDoctorToken(doctor, 201, res);
    SendEmail({
      email: doctor.email,
      subject: "Account Create",
      message: `Hello ${doctor.name}, your account is create in HealthBridge`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
exports.loginDoctor = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ message: "Please Enter Email & Password" });
  }
  const doctor = await doctorModel.findOne({ email }).select("+password");
  if (!doctor) {
    return next(new ErrorHandler("Doctor doesn't exists!", 400));
  }
  const isPasswordMatched = await doctor.comparePassword(password);
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Email & password does not matched", 400)
    );
  }
  if (isPasswordMatched) {
    sendToken(doctor, 200, res);
    // sendDoctorToken(doctor, 201, res);
    await doctorModel.updateOne({ email }, { $set: { isActive: true} })
  }
  else {
    res.json({ message: "Please valid Password" });
  }
};

exports.logoutDoctor = async (req, res) => {
  const newData = {
    isActive: req.body.isActive,
  };
  const doctor= await doctorModel.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    doctor
  });
};

// forgot password 
exports.doctorforgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const doctor = await doctorModel.findOne({ email: email });
  if (!doctor) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Get ResetPassword Token
  const resetToken = doctor.getResetPasswordToken();
  await doctor.save({ validateBeforeSave: false }); //database e save
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/forgot/password/reset/${resetToken}`;
  const resetPasswordUrl = `https://diu-health-bridge.netlify.app/forgot/password/reset/${resetToken}`;
  const message = `Your password reset token is :- ${resetPasswordUrl}`;
  try {
    await SendEmail({
      email: doctor.email,
      subject: `Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${doctor.email} successfully`,
    });
  } catch (error) {
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpire = undefined;
    await doctor.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
// Reset Password
exports.doctorResetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const doctor = await doctorModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!doctor) {
    return next(
      new ErrorHandler("Reset Password Token Expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Both password does not matched", 400)
    );
  }
  doctor.password = req.body.password;
  doctor.resetPasswordToken = undefined;
  doctor.resetPasswordExpire = undefined;
  await doctor.save();
  sendDoctorToken(doctor, 201, res);
}
exports.doctorUpdatePassword = async (req, res, next) => {
  const doctor = await doctorModel.findById(req.user._id).select("+password");
  const isPasswordMatched = await doctor.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password does not match", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("New password & confirm password not matched", 400));
  }
  doctor.password = req.body.newPassword;
  await doctor.save();
  sendDoctorToken(doctor, 200, res);
};
exports.doctorUpdateUrl = async (req, res, next) => {
  const newData = {
    url: req.body.url,
  };
 const doctor= await doctorModel.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    doctor
  });

};

// Get User Detail
exports.getDoctorDetails = async (req, res, next) => {
  const doctor = await doctorModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    doctor,
  });
};


// get all doctor for users
exports.getAllDoctors = asyncHandler(async (req, res) => {
  const resultPerPage = 5;
  const doctorCount = await doctorModel.countDocuments();
  const apiFeature = new ApiFeatures(doctorModel.find().sort({createdAt:-1}), req.query)
    .search()
    .filter()

  let doctors = await apiFeature.query;
  let filteredDoctorsCount = doctors.length;
  apiFeature.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    doctors,
    doctorCount,
    resultPerPage,
    filteredDoctorsCount

  });
});
// get all doctors for admin
exports.getDoctors = asyncHandler(async (req, res) => {
  const Doctors = await doctorModel.find();
  res.status(200).json({ success: true, Doctors });
});
// get single doctor
exports.doctorDetails = asyncHandler(async (req, res) => {
  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    return res.status(500).json({
      message: "Doctor is not Found !!"
    });
  }
  res.status(200).json({
    success: true,
    doctor,

  });
});
// update doctor
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    return res.status(500).json({
      success: false,
      message: "Doctor is not found !!"
    });
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < doctor.images.length; i++) {
      await cloudinary.v2.uploader.destroy(doctor.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "doctors",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  doctor = await doctorModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  SendEmail({
    email: req.body.email,
    subject: "MKM Health Bridge",
    message: `Hii Dr. ${doctor.name}, Your profile is updated on MKM Health Bridge online `
  });
  res.status(200).json({
    success: true,
    doctor,
  });
});
//delete doctor
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  try {
    const deleteDoctor = await doctorModel.findOneAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Doctor Delete Successfully",
      deleteDoctor
    });
  } catch (error) {
    throw new Error(error);
  }

});
// Create New Review or Update the review
exports.createDoctorReview = async (req, res, next) => {
  const { rating, comment, doctorId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const doctor = await doctorModel.findById(doctorId);
  const isReviewed = doctor.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    doctor.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    doctor.reviews.push(review);
    doctor.numOfReviews = doctor.reviews.length;
  }

  let avg = 0;
  doctor.reviews.forEach((rev) => {
    avg += rev.rating;
  }); //average review
  doctor.ratings = avg / doctor.reviews.length;
  await doctor.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
};
// Get All Reviews of a product
exports.getDoctorReviews = async (req, res, next) => {
  const doctor = await doctorModel.findById(req.query.id);
  if (!doctor) {
    res.json({ message: "Doctor is not Found" })
  }
  res.status(200).json({
    success: true,
    reviews: doctor.reviews,
  });
};
// Delete Review
exports.deleteReview = async (req, res, next) => {
  const doctor = await doctorModel.findById(req.query.doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = doctor.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  ); //jeita delete korbo seita hobe
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;
  await doctorModel.findByIdAndUpdate(
    req.query.doctorId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
};