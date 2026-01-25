const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  dog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dog",
    required: true,
  },
  foodtype: {
    type: String,
    required: true,
    enum: { values: ["wet", "dry"] },
    trim: true,
  },
  flavor: {
    type: String,
    required: true,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 1,
    max: 60,
    required: true,
  },
});

module.exports = mongoose.model("Food", foodSchema);
