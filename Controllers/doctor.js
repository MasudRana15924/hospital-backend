const doctorModel = require('../models/Doctors');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utilies/apiFeatures');
// only admin access this 
exports.createDoctor = asyncHandler(async (req, res) => {
    const newDoctor = await doctorModel.create(req.body);
    res.status(201).json({ success: true, newDoctor });
});
// get all doctor for users
exports.getAllDoctors = asyncHandler(async (req, res) => {
    const resultPerPage=5;
    const doctorCount=await doctorModel.countDocuments();
    const apiFeature = new ApiFeatures(doctorModel.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const doctors = await apiFeature.query;
    res.status(200).json({
        success: true,
        doctors,
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
    doctor = await doctorModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
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