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
exports.getNurses = asyncHandler(async (req, res) => {
    const Nurses = await nurseModel.find();
    res.status(200).json({ success: true, Nurses });
});
exports.nurseDetails = asyncHandler(async (req, res) => {
    const nurse = await nurseModel.findById(req.params.id);
    if (!nurse) {
        return res.status(500).json({
            message: "Nurse is not Found !!"
        });
    }
    res.status(200).json({
        success: true,
        nurse,
    
    });
});
exports.createNursesReview = async (req, res, next) => {
    const { rating, comment, nurseId } = req.body;
    const review = {
         user: req.user._id,
         name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const nurse = await nurseModel.findById(nurseId);
    const isReviewed = nurse.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        nurse.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        nurse.reviews.push(review);
        nurse.numOfReviews = nurse.reviews.length;
    }

    let avg = 0;
    nurse.reviews.forEach((rev) => {
        avg += rev.rating;
    }); //average review
    nurse.ratings = avg / nurse.reviews.length;
    await nurse.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};
// Get All Reviews of a product
exports.getNurseReviews = async (req, res, next) => {
    const nurse = await nurseModel.findById(req.query.id);
    if (!nurse) {
        res.json({ message: "nurse is not Found" })
    }
    res.status(200).json({
        success: true,
        reviews: nurse.reviews,
    });
};