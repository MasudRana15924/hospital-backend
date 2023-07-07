const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctortitle: {
    type: String,
    // required: true,
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
    // required: true,
  },
  doctorwork: {
    type: String,
    // required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
  },
  email:{
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
    // required: true,
  },
  weight: {
    type: Number,
    // required: true,
  },
  height: {
    type: String,
    // required: true,
    default: 0,
  },
  problem: {
    type: String,
    // required: true,
  },
  schedule: {
    type: String,
  },
  date: {
    type: String,
  },

  bookingStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  paidStatus: {
    type: Boolean,
    default: false
  },
  trans_id: {
    type: String,
  },
  meeturl: {
    type: String
  },
  url: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);