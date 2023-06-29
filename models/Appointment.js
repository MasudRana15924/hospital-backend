const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctortitle: {
    type: String,
    required: true,
  },
  doctorname: {
    type: String,
  },
  doctorfees: {
    type: Number,

  },
  doctorimage: {
    type: String,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
  },
  doctordegree: {
    type: String,
    required: true,
  },
  doctorwork: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
    default: 0,
  },
  patientname: {
    type: String,
  },
  patientemail: {
    type: String,
  },
  patientgender: {
    type: String,
  },
  schedule: {
    type: String,
  },
  date: {
    type: String,
  },
  totalFees: {
    type: Number,
    required: true,
    default: 0,
  },
  bookingStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  prescription: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);