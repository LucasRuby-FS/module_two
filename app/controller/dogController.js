const Dog = require("../model/Dog");

const getAllDog = async (req, res) => {
  try {
    const dog = await Dog.find({});
    res.status(200).json({
      message: `${req.method} - All Dogs Request Made`,
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Dog API with ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    res.status(200).json({
      message: `${req.method} - Dog Id request made`,
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Dog API Get by Id ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const createDog = async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    res.status(201).json({
      message: `Accepted Creation From the Dog API with ${req.method}`,
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Dog API Creation request ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const updateDog = async (req, res) => {
  try {
    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedDog) {
      return res.status(404).json({
        message: "Dog not found",
        success: false,
      });
    }
    res.status(200).json({
      message: `${req.method} - Dog Update request made`,
      success: true,
      data: updatedDog,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error with the Update Dog ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const deleteDog = async (req, res) => {
  try {
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `${req.method} - Deleted Dog request made`,
      success: true,
      data: deletedDog,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Delete Dog API route with ${req.method}`,
      success: false,
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
