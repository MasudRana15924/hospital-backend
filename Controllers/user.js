const userModel = require('../models/User');
const sendToken = require('../utilies/jwtToken');
const SendEmail = require('../utilies/sendEmail');
const jwt = require("jsonwebtoken");
const cache = require('memory-cache');
const nodemailer = require("nodemailer");
const cloudinary = require('cloudinary');
const crypto = require("crypto");

exports.createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await userModel.findOne({ email: email });
    
    if (!findUser) {
        const newUser = await userModel.create(req.body);
        const token = newUser.getJWTToken();
        await SendEmail({
            email: newUser.email,
            subject: "Activate Your Account",
            message: '<p> Hii ' + newUser.name + ', please click here to  <a href="http://localhost:3000/verification/id=' + newUser._id + '">Verify Email</a> '
        });
        sendToken(newUser, 201, res);
    }else{
        res.json({message:"Exits"})
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.id, { $set: { isVarified: 1 } }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.json({ message: 'verify' })

    } catch (error) {
        console.log(error);
    }
}
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ message: "Please Enter Email & Password" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        res.json({ message: "User not Exits" });
    }
    const isPasswordMatched = await user.comparePassword(password);
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
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return next(("User not found", 404));
    }
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false }); //database e save
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}://${req.get(
    //     "host"
    // )}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- ${resetPasswordUrl}`;
    try {
        await SendEmail({
            email: user.email,
            subject: `Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next((error.message, 500));
    }
};

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
            "Reset Password Token is invalid or has been expired",
            400
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(("Password does not password", 400));
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
        res.json({ message: "Old Password is not Matched" });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        res.json({ message: "Password is not Matched" });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);

};

// update User Profile
exports.updateProfile = async (req, res, next) => {
    const { name ,gender,birthdate,phone} = req.body;
    const newUserData = {
        name ,gender,birthdate,phone
    };

    if (req.body.avatar !== "") {
        const user = await userModel.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user
    });
};
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