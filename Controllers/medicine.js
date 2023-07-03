const medicineModel = require('../models/Medicine');
const cloudinary = require('cloudinary');
const ErrorHandler = require("../utilies/ErrorHandler");
const ApiFeatures = require('../utilies/apiFeatures');



exports.createMedicine = async (req, res, next) => {
    try {
        const {name,type,price,image,company,quantity } = req.body;
        const findMedicine = await medicineModel.findOne({ name: name });
        // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        //     folder: "medicines",
        //     width: 300,
        //     crop: "scale",
        //     fileSize: 5 * 1024 * 1024 
            
        // });
        if (findMedicine) {
            return next(new ErrorHandler("This Medicine already exists", 400));
        }
        const medicines = await medicineModel.create({
            name,type,price,image,company,quantity,
            // image: {
            //     public_id: myCloud.public_id,
            //     url: myCloud.secure_url,
            // },
        });
        res.status(201).json({
            success: true,
            medicines,
          });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};
// get all doctor for users
exports.getAllMedicines = async (req, res) => {

    const resultPerPage=5;
    const medicineCount=await medicineModel.countDocuments();
    const apiFeature = new ApiFeatures(medicineModel.find(), req.query)
        .search()
        .filter()
        
    const medicines = await apiFeature.query;
    apiFeature.pagination(resultPerPage);
    res.status(200).json({
        success:true,
        medicines,
         medicineCount,
         resultPerPage

    });
  };