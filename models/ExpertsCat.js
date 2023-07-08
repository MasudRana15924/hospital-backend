const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

  title: {
    type: String,
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

module.exports = mongoose.model("Category", categorySchema);