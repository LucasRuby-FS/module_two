const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodtype: {
    type: String,
    required: [true, "Please tell me if the dog prefers wet or dry dog food."],
    enum: {
      values: ["wet", "dry"],
      message: "Food type must be either 'wet' or 'dry'.",
    },
    trim: true,
  },
  flavor: {
    type: String,
    required: [
      true,
      "Please tell me what flavor dog food is preferred for your dog.",
    ],
    trim: true,
  },
  cost: {
    type: Number,
    required: [
      true,
      "Please tell me the amount of money you will pay for the dog food.",
    ],
    min: [1, "Don't be a cheap owner."],
    max: [60, "You will not pay that much for dog food, don't kid yourself."],
  },
});

module.exports = mongoose.model("Food", foodSchema);
