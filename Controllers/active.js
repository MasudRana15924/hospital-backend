const asyncHandler = require('express-async-handler');
const activeModel = require('../models/Active');


// only admin access this 
exports.createActive = asyncHandler(async (req, res) => {
    const active= await activeModel.create(req.body);
    res.status(201).json({
        success: true,
        active
      });
});
exports.getActive = asyncHandler(async (req, res) => {
    const status = await activeModel.find();
    res.status(200).json({ success: true, status });
});