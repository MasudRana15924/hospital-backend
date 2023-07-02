const { ObjectId } = require('mongodb');
const appointmentModel = require('../models/Appointment');
const ApiFeatures = require('../utilies/apiFeatures');
const SendEmail = require('../utilies/sendEmail');
const SSLCommerzPayment = require('sslcommerz-lts');
const tran_id = new ObjectId().toString();
// Create new appointment
// exports.newAppointment = async (req, res, next) => {
//   const {
//     doctortitle,
//     doctorname,
//     doctoremail,
//     doctorfees,
//     doctorimage,
//     doctorId,
//     doctordegree,
//     doctorwork,
//     phone,
//     fees,
//     totalFees,
//     patientname,
//     patientemail,
//     patientgender,
//     date,
//     schedule,
//   } = req.body;

//   const appointment = await appointmentModel.create({
//     doctortitle,
//     doctorname,
//     doctoremail,
//     doctorfees,
//     doctorimage,
//     doctorId,
//     doctordegree,
//     doctorwork,
//     phone,
//     fees,
//     totalFees,
//     patientname,
//     patientemail,
//     patientgender,
//     date,
//     schedule,
//     user: req.user._id,
//   });

//   const data = {
//     total_amount: req.body.doctorfees,
//     currency: 'BDT',
//     tran_id: tran_id, // use unique tran_id for each api call
//     success_url: 'http://localhost:3030/success',
//     fail_url: 'http://localhost:3030/fail',
//     cancel_url: 'http://localhost:3030/cancel',
//     ipn_url: 'http://localhost:3030/ipn',
//     doctor_name: appointment?.doctorname,
//     cus_name: appointment?.patientname,
//     cus_email: appointment?.patientemail,
//     doctor_name: req.body.doctorname,
//     cus_name: req.body.patientname,
//     cus_email: req.body.patientemail,
//     cus_country: 'Bangladesh',
//      cus_phone: appointment?.phone,
//   };
//   if (appointment) {
//     await SendEmail({
//       email: patientemail,
//       subject: "You have booked an Appointment",
//       message: `Hii ${patientname}, You have booked an Appointment of Dr. ${doctorname} \n\n Appointment Fees ${doctorfees} \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
//     });
//   }
//   await SendEmail({
//     email: doctoremail,
//     subject: "You have booked an Appointment",
//     message: `Hii ${doctorname} , You got Appointment from ${patientname}  \n\n Appointment Date ${date} \n\n Appointment Schedule ${schedule}`
//   });
//     res.status(201).json({
//       success: true,
//       appointment,
//     });
// };
exports.newAppointment = async (req, res) => {
  const {
    doctortitle,
    doctorname,
    doctoremail,
    doctorfees,
    doctorimage,
    doctorId,
    doctordegree,
    doctorwork,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
    url,
  } = req.body;

  // const appointment = await appointmentModel.create({
  //   doctortitle,
  //   doctorname,
  //   doctoremail,
  //   doctorfees,
  //   doctorimage,
  //   doctorId,
  //   doctordegree,
  //   doctorwork,
  //   phone,
  //   fees,
  //   totalFees,
  //   patientname,
  //   patientemail,
  //   patientgender,
  //   date,
  //   schedule,
  //   user: req.user._id,
  // });
  const data = {
    total_amount: req.body.doctorfees,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:5000/api/success/${tran_id}`,
    fail_url: 'http://localhost:3030/fail',
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: req.body.patientname,
    cus_email: req.body.patientgender,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: req.body.phone,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false);
  sslcz.init(data).then(apiResponse => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL
    res.send({url:GatewayPageURL});
  });
   const appointment = await appointmentModel.create({
    doctortitle,
    doctorname,
    doctoremail,
    doctorfees,
    doctorimage,
    doctorId,
    doctordegree,
    doctorwork,
    phone,
    fees,
    totalFees,
    patientname,
    patientemail,
    patientgender,
    date,
    schedule,
    url,
    user: req.user._id,
    paidStatus:false,
    trans_id:tran_id,
  });
}
exports.paymentSuccessful=async(req,res,next)=>{
    const appointment=await appointmentModel.updateOne({trans_id:req.params.tranId},{
      $set:{
        paidStatus:true
      }
    });
    if(appointment.modifiedCount>0){
      res.redirect(`https://diu-health-bridge.netlify.app/payment/successfull/${req.params.tranId}`);
    }
}




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
  const appointment = await appointmentModel.find({ doctorId: req.user._id });
  res.status(200).json({
    success: true,
    appointment,
  });
};
exports.updatePrescription = async (req, res, next) => {
  const { prescription, patientemail, patientname } = req.body;
  const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, prescription);
  appointment.prescription = req.body.prescription;
  await appointment.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    appointment
  });
  await SendEmail({
    email: patientemail,
    subject: "Appointment Update",
    message: `Hii ${patientname}, You have a prescription ${prescription}`
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