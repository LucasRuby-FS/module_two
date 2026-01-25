//Import Food model
const Food = require("../model/Food");
//Import reusable response messages
const Messages = require("../../messages/messages");
//Import mongoose for ObjectId validation
const mongoose = require("mongoose");
//Import Dog model to associate food with dogs
const Dog = require("../model/Dog");

const getAllFood = async (req, res) => {
  //Destructure query parameters
  try {
    const {
      foodtype,
      flavor,
      minCost,
      maxCost,
      excludeFields,
      sortBy,
      page,
      limit,
    } = req.query;

    //filtering
    //EX Filter by type and flavor, with cost range:
    //GET /api/v1/foods?foodtype=wet&flavor=chicken&minCost=10&maxCost=50
    //Returns all wet chicken food costing between 10 and 50.
    let filter = {};
    //Filter by food type(s)
    if (foodtype) filter.foodtype = { $in: foodtype.split(",") };
    //Filter by flavor
    if (flavor) filter.flavor = { $in: flavor.split(",") };
    //Filter by cost range
    //EX GET /api/v1/foods?excludeFields=cost
    if (minCost || maxCost) filter.cost = {};
    if (minCost) filter.cost.$gte = parseFloat(minCost);
    if (maxCost) filter.cost.$lte = parseFloat(maxCost);
    //Pagination logic
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    //Exlude specific fields or default to hiding __v
    const selectFields = excludeFields
      ? "-" + excludeFields.split(",").join(" -")
      : "-__v";
    //Sort by flavor and paginate:
    //EX GET /api/v1/foods?sortBy=flavor&page=2&limit=5
    const sortOptions = sortBy || "foodtype";
    //Query database
    const food = await Food.find(filter)
      .populate("dog", "name breed age size -_id")
      .select(selectFields)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    //Success
    res.status(200).json({
      success: true,
      message: Messages.FOOD_FOUND,
      count: food.length,
      data: food,
    });
    //Server error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.FOOD_NOT_FOUND,
      error: error.message,
    });
  }
};
//Get a food item by ID
//EX GET /api/v1/food/:id
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    //Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    //Find food by ID and populate dog reference
    const food = await Food.findById(id)
      .populate("dog", "name breed age size -_id")
      .select("-__v");
    //Food not found
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    //Success
    res.status(200).json({
      success: true,
      message: Messages.FOOD_FOUND,
      data: food,
    });
    //Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Create a new food item and link it to a dog
//EX POST /api/v1/food
const createFood = async (req, res) => {
  try {
    const { dog: dogId } = req.body;
    // Validate dog ID
    if (!mongoose.Types.ObjectId.isValid(dogId)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    // Check if dog exists
    const dogExists = await Dog.findById(dogId);
    if (!dogExists) {
      return res
        .status(404)
        .json({ success: false, message: Messages.DOG_NOT_FOUND });
    }
    // Create food item
    const food = await Food.create(req.body);
    // Add food reference to dog's foodLis
    dogExists.foodList.push(food._id);
    await dogExists.save();
    //Success
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
//Update a food item by ID
//EX PUT /api/v1/food/:id
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    // Update food item
    const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");
    // Food not found
    if (!updatedFood) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    //Success
    res.status(200).json({
      success: true,
      message: Messages.FOOD_UPDATED,
      data: updatedFood,
    });
    //Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Delete a food item by ID
//EX DELETE /api/v1/food/:id
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    // Delete food item
    const deletedFood = await Food.findByIdAndDelete(id).select("-__v");
    // Food not found
    if (!deletedFood) {
      return res
        .status(404)
        .json({ success: false, message: Messages.FOOD_NOT_FOUND });
    }
    //Success
    res.status(200).json({
      success: true,
      message: Messages.FOOD_DELETED,
      data: deletedFood,
    });
    //Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
// Export controller functions
module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
