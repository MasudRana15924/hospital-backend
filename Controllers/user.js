const userModel = require('../models/User');
const sendToken = require('../utilies/jwtToken');
const SendEmail = require('../utilies/sendEmail');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary');
const crypto = require("crypto");
const ErrorHandler = require("../utilies/ErrorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


exports.createUser = async (req, res, next) => {
    try {
        const { title, name, gender, birthdate, district, nid_No, bmdc_No, type, phone, email, password, role } = req.body;
        const findUser = await userModel.findOne({ email: email });
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 300,
            crop: "scale",
            fileSize: 5 * 1024 * 1024 
            
        });
        if (findUser) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const user = await userModel.create({
            title, name, gender, birthdate, district, nid_No, bmdc_No, type, phone, email, password, role,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        });

        sendToken(user, 201, res);
        SendEmail({
            email: user.email,
            subject: "Activate Your Account",
            message: `Hello ${user.name}, your account is create`,

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
};
// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        const newUser = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET
        );
        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, } = newUser;
        let user = await userModel.findOne({ email });
        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        }
        registerUser = await userModel.create({
            name,
            email,
            password,
        });
        sendToken(registerUser, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ message: "Please Enter Email & Password" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Email & password does not matched", 400)
        );
    }
    if (isPasswordMatched) {
        sendToken(user, 200, res);
    }
    else {
        res.json({ message: "Please valid Password" });
    }
};

exports.logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
};
// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false }); //database e save
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const resetPasswordUrl = `https://health-bridge-4179.vercel.app/password/reset/${resetToken}`;
    // const resetPasswordUrl = `https://diu-health-bridge.netlify.app/password/reset/${resetToken}`;
    const message = `Your password reset token is :- ${resetPasswordUrl}`;
    try {
        await SendEmail({
            email: user.email,
            subject: `Password Recovery`,
            message,
            // html:`<a href=${message} >Click here</a>`
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }

});

// Reset Password
exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandler("Reset Password Token Expired", 400)
          );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Both password does not matched", 400)
          );
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
};
// update User password
exports.updatePassword = async (req, res, next) => {
    const user = await userModel.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password does not match", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New password & confirm password not matched", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);

};

// update User Profile
exports.updateProfile = async (req, res, next) => {
    // const { name, gender, birthdate, phone } = req.body;
    // const newUserData = {
    //     name, gender, birthdate, phone
    // };
        const newUserData = req.body;
         const user = await userModel.findById(req.user._id);
        // if(user){
        //     const imageId = user.avatar.public_id;
        // await cloudinary.v2.uploader.destroy(imageId);
        // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //     folder: "avatars",
        //     width: 150,
        //     crop: "scale",
        //     limits: {
        //         fileSize: 5 * 1024 * 1024 
        //       }
        // });
        // newUserData.avatar = {
        //     public_id: myCloud.public_id,
        //     url: myCloud.secure_url,
        // };
    
      const updateUser = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        updateUser
    });
        // }else {
        //     res.json({ message: "User not found" });
        // }
};

exports.updateAvatar = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        let newUserData;
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };

        const updateUser = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            updateUser
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

}
// Get single user (admin)
exports.getSingleUser = async (req, res, next) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        res.json({ message: "User does not exit" });
    }
    res.status(200).json({
        success: true,
        user,
    });
};

exports.getAllUsers = async (req, res) => {
    const users = await userModel.find();
    res.status(200).json({ success: true, users });
};

// update User Role -- Admin
exports.updateUserRole = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
};

// Delete User --Admin
exports.deleteUser = async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
        res.json({ message: "User does not exit" });
    }
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
};