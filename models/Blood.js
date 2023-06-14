const mongoose = require("mongoose");

const bloodsSchema = new mongoose.Schema({

 
 name: {
    type: String,
  },
  email: {
    type: String,
  },
 
  phone: {
    type: String,
  },
  group: {
    type: String,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bloods", bloodsSchema);