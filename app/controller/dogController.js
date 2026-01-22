const Dog = require("../model/Dog");
const Messages = require("../../messages/messages");
const mongoose = require("mongoose");
const getAllDog = async (req, res) => {
  try {
    const dog = await Dog.find({}).select("-__v");
    res.status(200).json({
      success: true,
      message: Messages.DOG_LIST,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

const getDogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: Messages.INVALID_ID,
      });
    }
    const dogs = await Dog.findById(id).select("-__v");
    if (!dogs) {
      return res.status(404).json({
        success: false,
        message: Messages.DOG_NOT_FOUND,
      });
    }
    res
      .status(200)
      .json({ success: true, message: Messages.DOG_FOUND, data: dogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

const createDog = async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    res.status(201).json({
      message: Messages.DOG_CREATED,
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }

    const updatedDog = await Dog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedDog) {
      return res.status(404).json({
        message: Messages.DOG_NOT_FOUND,
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: Messages.DOG_UPDATED,
      data: updatedDog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};

const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    const deletedDog = await Dog.findByIdAndDelete(id).select("-__v");

    if (!deletedDog) {
      return res.status(404).json({
        success: false,
        message: Messages.DOG_NOT_FOUND,
      });
    }
    res.status(200).json({
      message: Messages.DOG_DELETED,
      success: true,
      data: deletedDog,
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
  getDogById,
  getAllDog,
  createDog,
  updateDog,
  deleteDog,
};
