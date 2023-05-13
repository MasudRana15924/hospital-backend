const asyncHandler = require('express-async-handler');
const nurseModel = require('../models/Nurses');
const sendToken = require('../utilies/jwtToken');
const ApiFeatures = require('../utilies/apiFeatures');


// only admin access this 
exports.createNurse = asyncHandler(async (req, res) => {
    const newNurse = await nurseModel.create(req.body);
    res.status(201).json({
        success: true,
        newNurse,
      });
});
exports.getAllNurses = asyncHandler(async (req, res) => {
    const resultPerPage=5;
    const nurseCount=await nurseModel.countDocuments();
    const apiFeature = new ApiFeatures(nurseModel.find(), req.query)
        .search()
        .filter()
        
    const nurses = await apiFeature.query;
    apiFeature.pagination(resultPerPage);
    res.status(200).json({
        success:true,
        nurses,
        nurseCount,
         resultPerPage

    });
});