const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const doctorsSchema = mongoose.Schema({
    title: {
        type: String,
        // required: true,
    },
    name: {
        type: String,
        // required: true,
    },

    gender: {
        type: String,
        // required: true,
    },

    district: {
        type: String,
        // required: true,
    },
    nid_No: {
        type: Number,
        // required: true,
    },
    bmdc_No: {
        type: String,
        // required: true,
    },
    type: {
        type: String,
        // required: true,
    },
    phone: {
        type: Number,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true,
        select: false,
    },
    role: {
        type: String,
        default: "doctor",
    },
    avatar: {
        public_id: {
            type: String,
            //   required: true,
        },
        url: {
            type: String,
            //   required: true,
        }
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    work: {
        type: String,
        // required: true,
    },
    expert: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        // required: true,
    },
    degree: {
        type: String,
        // required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        // required: true,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                // required: true,
            },
            name: {
                type: String,
                // required: true,
            },
            rating: {
                type: Number,
                // required: true,
            },
            comment: {
                type: String,
                // required: true,
            },
        },
    ],
    fees: {
        type: Number,
        // required: true
    },
    url:{
        type:String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
doctorsSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
// // JWT TOKEN
doctorsSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
doctorsSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
// // Generating Password Reset Token
doctorsSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};


module.exports = mongoose.model("Doctors", doctorsSchema);