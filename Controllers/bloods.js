
const bloodModel = require('../models/Blood');
const ApiFeatures = require('../utilies/apiFeatures');
const SendEmail = require('../utilies/sendEmail');

// Create new appointment
exports.newBloodBooking = async (req, res, next) => {
  const {
    name,
    email,
    phone,
    group,
  } = req.body;

  const bloods = await bloodModel.create({
    name,
    email,
    phone,
    group,
    // user: req.user._id,
  });
  res.status(201).json({
    success: true,
    bloods,
  });
};