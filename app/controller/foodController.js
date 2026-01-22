const Food = require("../model/Food");
const Dog = require("../model/Dog");
const Messages = require("../../messages/messages");
const mongoose = require("mongoose");

const getAllFood = async (req, res) => {
  try {
    const food = await Food.find({})
      .populate("dog", "name breed age size -_id")
      .select("-__v");

    res.status(200).json({
      success: true,
      message: Messages.FOOD_FOUND,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.FOOD_NOT_FOUND,
      error: error.message,
    });
  }
};

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    const food = await Food.findById(id)
      .populate("dog", "name breed age size -_id")
      .select("-__v");

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    res.status(200).json({
      success: true,
      message: Messages.FOOD_FOUND,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

const createFood = async (req, res) => {
  try {
    const { dog: dogId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    const dogExists = await Dog.findById(dogId);
    if (!dogExists) {
      return res
        .status(404)
        .json({ success: false, message: Messages.DOG_NOT_FOUND });
    }
    const food = await Food.create(req.body);
    res.status(201).json({
      success: true,
      message: Messages.FOOD_CREATED,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedFood) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    res.status(200).json({
      success: true,
      message: Messages.FOOD_UPDATED,
      data: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    const deletedFood = await Food.findByIdAndDelete(id).select("-__v");
    if (!deletedFood) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    res.status(200).json({
      success: true,
      message: Messages.FOOD_DELETED,
      data: deletedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
