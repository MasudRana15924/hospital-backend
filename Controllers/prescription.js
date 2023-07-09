
const prescriptionModel = require('../models/prescription');


// only admin access this 
exports.createPrescription = async (req, res) => {
  console.log(req.body);
    const prescription= await prescriptionModel.create(req.body);
    console.log(prescription);
    res.status(201).json({
        success: true,
        prescription
      });
     
};
exports.myPrescription = async (req, res, next) => {
    const prescription = await prescriptionModel.find({ userId: req.user._id }).sort({createdAt:-1});
    res.status(200).json({
      success: true,
      prescription,
    });
  };