const mongoose = require("mongoose");

const activeSchema = new mongoose.Schema({

  title: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Active", activeSchema);