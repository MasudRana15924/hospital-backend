const mongoose = require("mongoose");

const bloodsSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
 
  phone: {
    type: Number,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bloods", bloodsSchema);