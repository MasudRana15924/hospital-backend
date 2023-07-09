const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    doctortitle: {
        type: String,
        // required: true,
    },
    doctorname: {
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
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
    },
    appointmentId: {
        type: mongoose.Schema.ObjectId,
        ref: "Appointment",
    },
    name: {
        type: String,
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
        // required: true,
    },
    problem: {
        type: String,
        // required: true,
    },
    weight: {
        type: Number,
        // required: true,
    },
    height: {
        type: String,
        // required: true,
    },
    medicines: [
        {
            medname: {
                type: String
            },
            dailyUse: {
                type: Number
            },
            days: {
                type: Number
            },
            quantity: {
                type: Number
            }
        }
    ],
    doctorAdvice: {
        type: String,
    },
    followUp: {
        type: String
    },
    date: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);