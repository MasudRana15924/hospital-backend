const asyncHandler = require('express-async-handler');
const categoryModel = require('../models/ExpertsCat');


// only admin access this 
exports.createCategory = asyncHandler(async (req, res) => {
    const category= await categoryModel.create(req.body);
    res.status(201).json({
        success: true,
        category
      });
});
exports.getAllCategory = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find();
    res.status(200).json({ success: true, categories });
});