
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
  });
 
  if (bloods) {
    await SendEmail({
      email: email,
      subject: "Emergency Blood",
      message: `Hii ${name}, You have apply for ${group} blood & we will contact very soon`
    });
  }
  res.status(201).json({
    success: true,
    bloods,
  });
};