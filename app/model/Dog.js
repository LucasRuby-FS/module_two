const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must give me the dog's name."],
    maxlength: [20, "The dog's name should not be over 20 characters."],
  },
  breed: {
    type: String,
    required: [true, "You must give me the dog's breed."],
    trim: true,
  },
  size: {
    type: String,
    required: true,
    enum: ["Small", "Big", "Large", "Medium"],
  },
  age: {
    type: Number,
    required: true,
    min: [1, "The dog's age must be at least 1 year"],
    max: [20, "If your dog is older than 20, it's not a dog."],
  },
  foodList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: false,
    },
  ],
});

module.exports = mongoose.model("Dog", dogSchema);
