const mongoose = require("mongoose");

const doctorSchema =new mongoose.Schema({
    name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "doctor",
	  },
	  createdAt: {
		type: Date,
		default: Date.now,
	  },
});

module.exports = mongoose.model("Doctor", doctorSchema);