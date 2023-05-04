const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
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
		select: false,
	},
	role: {
		type: String,
		default: "user",
	},
	isVarified: {
		type: Boolean,
		default: 0,
	},
	// avatar: {
	// 	public_id: {
	// 	  type: String,
	// 	  required: true,
	// 	},
	// 	url: {
	// 	  type: String,
	// 	  required: true,
	// 	},
	//   },
	createdAt: {
		type: Date,
		default: Date.now,
	},

	resetPasswordToken: String,
	resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});
// // JWT TOKEN
userSchema.methods.getJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};
// // Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
	// Generating Token with 20random word/bytes
	const resetToken = crypto.randomBytes(20).toString("hex");
	// token from resetToken database e ekta token generate hobe 
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
