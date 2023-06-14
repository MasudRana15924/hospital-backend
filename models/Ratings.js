const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({

  title: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ratings", ratingsSchema);