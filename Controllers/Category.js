const asyncHandler = require('express-async-handler');
const categoryModel = require('../models/ExpertsCat');
const cloudinary = require('cloudinary');

// only admin access this 
exports.createCategory = asyncHandler(async (req, res) => {
    const { title,image } = req.body;
    // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //     folder: "avatars",
    //     width: 300,
    //     crop: "scale",
    // });
    const category = await categoryModel.create({
        title,image
        // image: {
        //     public_id: myCloud.public_id,
        //     url: myCloud.secure_url,
        // }
    });

    res.status(201).json({
        success: true,
        category
    });
});
exports.getAllCategory = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find();
    res.status(200).json({ success: true, categories });
});