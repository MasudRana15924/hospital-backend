const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

  bookingAppointment: [
    {
      name: {
        type: String,
        required: true,
      },
      fees: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      doctor: {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required: true,
      },
    },
  ],
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
  schedule: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);