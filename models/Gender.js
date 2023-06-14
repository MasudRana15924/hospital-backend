const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema({

  title: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gender", genderSchema);