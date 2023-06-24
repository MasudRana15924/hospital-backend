const { ObjectId } = require('mongodb');
const appointmentModel = require('../models/Appointment');
const ApiFeatures = require('../utilies/apiFeatures');
const SendEmail = require('../utilies/sendEmail');
const SSLCommerzPayment = require('sslcommerz-lts')
// Create new appointment
exports.newAppointment = async (req, res, next) => {
  const {
    doctorname,
    doctoremail,
    doctorfees,
    doctorimage,
    doctorId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
  } = req.body;

  const appointment = await appointmentModel.create({
    doctorname,
    doctoremail,
    doctorfees,
    doctorimage,
    doctorId,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
    user: req.user._id,
  });
  const tran_id = new ObjectId().toString()
  const data = {
    total_amount: appointment?.doctorfees,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: 'http://localhost:3030/success',
    fail_url: 'http://localhost:3030/fail',
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    doctor_name: appointment?.doctorname,
    cus_name: appointment?.patientname,
    cus_email: appointment?.patientemail,
    cus_country: 'Bangladesh',
    cus_phone: appointment?.phone,
  };
  if (appointment) {
    await SendEmail({
      email: patientemail,
      subject: "You have booked an Appointment",
      message: `Hii ${patientname}, You have booked an Appointment of Dr. ${doctorname} \n\n Appointment Fees ${doctorfees} \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
    });
    await SendEmail({
      email: patientemail,
        subject: "You have booked an Appointment",
        message: `Hii ${patientname}, You have booked an Appointment of Dr. ${doctorname} \n\n Appointment Fees ${doctorfees} \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
      });
  }
  await SendEmail({
    email: doctoremail,
      subject: "You have booked an Appointment",
      message: `Hii ${doctorname} , You got Appointment from ${patientname}  \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
    });

  const is_live = false;
  const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, is_live);
  let GatewayPageURL
  sslcz.init(data).then(apiResponse => {
     GatewayPageURL = apiResponse.GatewayPageURL
    //  res.send({GatewayPageURL, appointment})
  });
  res.status(201).json({
    success: true,
    appointment,
    GatewayPageURL,
  });
};

// get Single 
exports.getSingleAppointment = async (req, res, next) => {
  const appointment = await appointmentModel.findById(req.params.id)
  if (!appointment) {
    res.json({ message: "Not found a appointment with this id" })
  }
  res.status(200).json({
    success: true,
    appointment,
  });
};
// get logged in user  
exports.myAppointment = async (req, res, next) => {
  const appointment = await appointmentModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    appointment,

  });
};
// doctor got his appointment list
exports.doctorAppointment = async (req, res, next) => {
  const appointment = await appointmentModel.find({doctorId: req.doctor._id });
  res.status(200).json({
    success: true,
    appointment,
  });
};

// get all Appointments
exports.getAllAppointments = async (req, res, next) => {
  const resultPerPage = 3;
  const appointmentCount = await appointmentModel.countDocuments();
  // const appointments = await appointmentModel.find();
  const apiFeature = new ApiFeatures(appointmentModel.find(), req.query);
  const appointments = await apiFeature.query;
  apiFeature.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    appointments,
    resultPerPage,
    appointmentCount
  });
};
// update 
exports.updateBooking = async (req, res, next) => {
  const { bookingStatus, patientemail, patientname, doctorname } = req.body;
  const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, bookingStatus);
  appointment.bookingStatus = req.body.bookingStatus;
  await appointment.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    appointment
  });
  await SendEmail({
    email: patientemail,
    subject: "Appointment Update",
    message: `Hii ${patientname}, Your Appointment of Dr. ${doctorname} is ${bookingStatus}`
  });


};

// delete 
exports.deleteAppointment = async (req, res, next) => {
  const booking = await appointmentModel.findByIdAndDelete(req.params.id);
  if (!booking) {
    res.json({ message: "Appointment does not exit" });
  }
  res.status(200).json({
    success: true,
  });
};