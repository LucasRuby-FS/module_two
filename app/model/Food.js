const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodtype: {
    required: [true, "Please tell me if the dog prefers wet or dry dog food."],
    maxlength: [3, "Dog food is only 3 letters."],
    trim: true,
  },
  flavor: {
    type: String,
    required: [
      true,
      "Please tell me what flavor dog food is preferred for your dog.",
    ],
  },
  cost: {
    type: Number,
    required: [
      true,
      "Please tell me the amount of money you will pay for the dog food.",
    ],
    max: [60, "You will not pay that much for dog food, don't kid yourself."],
    min: [1, "Don't be a cheap owner."],
  },
});

module.exports = mongoose.model("Food", foodSchema);
