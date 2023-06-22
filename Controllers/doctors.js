// const doctorModel = require('../models/Doctors');
// const sendToken = require('../utilies/jwtToken');
// const SendEmail = require('../utilies/sendEmail');
// const jwt = require("jsonwebtoken");
// const cloudinary = require('cloudinary');
// const crypto = require("crypto");
// const ErrorHandler = require("../utilies/ErrorHandler");
// const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


// exports.registerDoctor = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { title, name, gender, birthdate, district, nid_No, bmdc_No, type, phone, email, password, work, expert, degree,experience } = req.body;
//         // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//         //     folder: "avatars",
//         //     width: 150,
//         //     crop: "scale",
//         // });
//         const findDoctor = await doctorModel.findOne({ email: email });
//         if (findDoctor) {
//             return next(new ErrorHandler("doctor already exists", 400));
//         }
//         const doctor = await doctorModel.create({
//             title, name, gender, birthdate, district, nid_No, bmdc_No, type,
//             phone, email, password, work, expert, degree,experience
//             // avatar: {
//             //     public_id: myCloud.public_id,
//             //     url: myCloud.secure_url,
//             // },
//         });

//         sendToken(doctor, 201, res);
//         SendEmail({
//             email: doctor.email,
//             subject: "Activate Your Account",
//             message: `Hello ${doctor.name}, your account is create`,
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// });
// exports.loginDoctor = async (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         res.json({ message: "Please Enter Email & Password" });
//     }
//     const doctor = await doctorModel.findOne({ email }).select("+password");

//     if (!doctor) {
//         return next(new ErrorHandler("Doctor doesn't exists!", 400));
//     }
//     const isPasswordMatched = await doctor.comparePassword(password);
//     if (!isPasswordMatched) {
//         return next(
//             new ErrorHandler("Email & password does not matched", 400)
//         );
//     }
//     if (isPasswordMatched) {

//         sendToken(doctor, 200, res);
//         await newDoctorModel.updateOne({ email }, { $set: { isActive: 'true' } })
//         // res.send(updateDoctor);

//     }

//     else {
//         res.json({ message: "Please valid Password" });
//     }
// };
// exports.logoutDoctor = async (req, res) => {
//     // res.cookie("token", null, {
//     //     expires: new Date(Date.now()),
//     //     httpOnly: true,
//     // });
//     const { email } = req.body;
//     const updateDoctor = await doctorModel.updateOne({ email }, { $set: { isActive: 'false' } })
//     res.status(200).json({
//         success: true,
//         updateDoctor
//     });
// };