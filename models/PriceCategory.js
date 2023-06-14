const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({

  title: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fees", feesSchema);