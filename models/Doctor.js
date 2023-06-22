// const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");

// const newDoctorSchema = new mongoose.Schema({
//     title: {
// 		type: String,
// 		required: true,
// 	},
// 	name: {
// 		type: String,
// 		required: true,
// 	},
	
// 	gender: {
// 		type: String,
//          required: true,
// 	},

//     district: {
// 		type:String,
//         required: true,
// 	},
//     nid_No: {
// 		type:Number,
//         required: true,
// 	},
//     bmdc_No: {
// 		type:Number,
//         required: true,
// 	},
//     type: {
// 		type: String,
//         required: true,
// 	},
//     phone: {
// 		type:Number,
//         required: true,
// 	},
//     email: {
// 		type: String,
// 		required: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 		select: false,
// 	},
// 	role: {
// 		type: String,
// 		default: "doctor",
// 	},
// 	avatar: {
// 		public_id: {
// 		  type: String,
// 		//   required: true,
// 		},
// 		url: {
// 		  type: String,
// 		//   required: true,
// 		},
// 	  },
// 	  isActive: {
// 		type: String,
// 		default: "false",
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now,
// 	},

// 	resetPasswordToken: String,
// 	resetPasswordExpire: Date,
// });
// newDoctorSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) {
// 		next();
// 	}
// 	this.password = await bcrypt.hash(this.password, 10);
// });
// // // JWT TOKEN
// newDoctorSchema.methods.getJWTToken = function () {
// 	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
// 		expiresIn: process.env.JWT_EXPIRE,
// 	});
// };
// newDoctorSchema.methods.comparePassword = async function (password) {
// 	return await bcrypt.compare(password, this.password);
// };
// // // Generating Password Reset Token
// newDoctorSchema.methods.getResetPasswordToken = function () {
// 	const resetToken = crypto.randomBytes(20).toString("hex");
// 	this.resetPasswordToken = crypto
// 		.createHash("sha256")
// 		.update(resetToken)
// 		.digest("hex");
// 	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
// 	return resetToken;
// };

// module.exports = mongoose.model("newDoctor", newDoctorSchema);
