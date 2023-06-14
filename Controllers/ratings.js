const asyncHandler = require('express-async-handler');
const ratingModel = require('../models/Ratings');


// only admin access this 
exports.createRatings = asyncHandler(async (req, res) => {
    const ratings= await ratingModel.create(req.body);
    res.status(201).json({
        success: true,
        ratings
      });
});
exports.getAllRatings = asyncHandler(async (req, res) => {
    const ratings = await ratingModel.find();
    res.status(200).json({ success: true, ratings });
});