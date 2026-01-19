const Dog = require("../model/Dog");

const getAllDog = async (req, res) => {
  res.status(200).json({
    message: `From the Dog API route with ${req.method}`,
    success: true,
  });
};

const getDogById = async (req, res) => {
  res.status(200).json({
    message: `From the Dog API route with ${req.method}`,
    success: true,
  });
};

const createDog = async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    res.status(200).json({
      message: `From the Dog API route with ${req.method}`,
      dog,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error.name);
    res.status(404).json({
      message: `Error from the Dog API route with ${req.method}`,
      success: false,
    });
  }
};

const updateDog = async (req, res) => {
  console.log(req.params.id);
  try {
    const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: `From the Dog API with ${req.method}`,
      dog,
      success: true,
    });
  } catch (error) {
    console.log("ERROR:", error.name);
    res.status(404).json({
      message: `Error from the Dog API route with ${req.method}`,
      success: false,
    });
  }
};

const deleteDog = async (req, res) => {
  res.status(200).json({
    //
  });
};

module.exports = [getAllDog, getDogById, createDog, updateDog, deleteDog];
