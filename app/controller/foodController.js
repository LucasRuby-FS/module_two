const Food = require("../model/Food");
const Messages = require("../../messages/messages");
const mongoose = require("mongoose");
const Dog = require("../model/Dog");
const getAllFood = async (req, res) => {
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
    let filter = {};
    //Filter by type and flavor, with cost range:
    //GET /api/v1/foods?foodtype=wet&flavor=chicken&minCost=10&maxCost=50
    //Returns all wet chicken food costing between 10 and 50.
    if (foodtype) filter.foodtype = { $in: foodtype.split(",") };
    if (flavor) filter.flavor = { $in: flavor.split(",") };
    //Exclude cost from the response:
    //GET /api/v1/foods?excludeFields=cost
    if (minCost || maxCost) filter.cost = {};
    if (minCost) filter.cost.$gte = parseFloat(minCost);
    if (maxCost) filter.cost.$lte = parseFloat(maxCost);

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const selectFields = excludeFields
      ? "-" + excludeFields.split(",").join(" -")
      : "-__v";

    const sortOptions = sortBy || "foodtype";
    //Sort by flavor and paginate:
    //GET /api/v1/foods?sortBy=flavor&page=2&limit=5
    const food = await Food.find(filter)
      .populate("dog", "name breed age size -_id")
      .select(selectFields)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      message: Messages.FOOD_FOUND,
      count: food.length,
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
    //populate foodlist
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

    dogExists.foodList.push(food._id);
    await dogExists.save();

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
