const asyncHandler = require('express-async-handler');
const feesModel = require('../models/PriceCategory');


// only admin access this 
exports.createFees = asyncHandler(async (req, res) => {
    const fees= await feesModel.create(req.body);
    res.status(201).json({
        success: true,
        fees
      });
});
exports.getAllFees = asyncHandler(async (req, res) => {
    const fees = await feesModel.find();
    res.status(200).json({ success: true, fees });
});