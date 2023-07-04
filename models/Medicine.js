const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    commonName: {
        type: String,
        // required: true,
    },
    company: {
        type: String,
        // required: true,
    },
    type: {
        type: String,
        // required: true,
    },
    price: {
        type: Number,
        // required: true,
    },
    quantity: {
        type: Number,
        // required: true,
    },
    image:
    {
        public_id: {
            type: String,
            // required: true,
        },
        url: {
            type: String,
            // required: true,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Medicine", medicineSchema);