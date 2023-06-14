const asyncHandler = require('express-async-handler');
const genderModel = require('../models/Gender');


// only admin access this 
exports.createGender = asyncHandler(async (req, res) => {
    const genders= await genderModel.create(req.body);
    res.status(201).json({
        success: true,
        genders
      });
});
exports.getAllGender = asyncHandler(async (req, res) => {
    const genders = await genderModel.find();
    res.status(200).json({ success: true, genders });
});