const newDoctorModel = require('../models/Doctor');
const sendToken = require('../utilies/jwtToken');
const SendEmail = require('../utilies/sendEmail');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary');
const crypto = require("crypto");
const ErrorHandler = require("../utilies/ErrorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


exports.registerDoctor =catchAsyncErrors( async (req, res, next) => {
    try {
        const {title, name,gender,birthdate,district,nid_No,bmdc_No,type,phone, email, password } = req.body;
        const findDoctor = await newDoctorModel.findOne({ email: email });
        if (findDoctor) {
            return next(new ErrorHandler("doctor already exists", 400));
        }
        const doctor = await newDoctorModel.create({
            title, name,gender,birthdate,district,nid_No,bmdc_No,type,phone, email, password
          });
        
          sendToken(doctor, 201, res);
          SendEmail({
                 email: doctor.email,
                subject: "Activate Your Account",
             message: `Hello ${doctor.name}, your account is create`,
    
             });

        // const user = {
        //     name: name,
        //     email: email,
        //     password: password,

        // };
        // const activationToken = createActivationToken(user);
        // const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        // res.status(201).json({
        //     success: true,
        //     message: `please check your email:- ${user.email} to activate your account!`,
        // });
        //  SendEmail({
        //     email: user.email,
        //     subject: "Activate your account",
        //     message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,

        // });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});