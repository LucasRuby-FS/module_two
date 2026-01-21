const Food = require("../model/Food");

const getAllFood = async (req, res) => {
  try {
    const food = await Food.find({});
    res.status(200).json({
      message: `${req.method} - All Food Request Made`,
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Food API with ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.status(200).json({
      message: `${req.method} - Food Id request made`,
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Food API Get by Id ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      message: `Accepted Creation From the Food API with ${req.method}`,
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Food API Creation request ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: `${req.method} - Food Update request made`,
      success: true,
      data: updatedFood,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error with the Updated Food ${req.method}`,
      success: false,
      error: error.message,
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `${req.method} - Deleted Food request made`,
      success: true,
      data: deletedFood,
    });
  } catch (error) {
    res.status(404).json({
      message: `Error from the Delete Food API route with ${req.method}`,
      success: false,
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
