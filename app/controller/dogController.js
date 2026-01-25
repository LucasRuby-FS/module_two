const Dog = require("../model/Dog");
const Messages = require("../../messages/messages");
const mongoose = require("mongoose");
const getAllDog = async (req, res) => {
  try {
    const { breed, size, minAge, maxAge, excludeFields, sortBy, page, limit } =
      req.query;
    //filtering
    //filter by breed and size, age range, excluding filtering foodlist, sort by age, page 2, 5 per page:
    //GET /api/v1/dogs?breed=Labrador,Beagle&size=Medium,Small&minAge=2&maxAge=10&excludeFields=foodList&sortBy=age&page=2&limit=5
    //filters breed in [Labrador, Beagle], size in [Medium,Small], 2 <= age <= 10
    //exlcudes filtering foodlist field
    //sorts by age
    //pagination: page 2, 5 per page.
    let filter = {};
    if (breed) filter.breed = { $in: breed.split(",") };
    if (size) filter.size = { $in: size.split(",") };
    if (minAge || maxAge) filter.age = {};
    if (minAge) filter.age.$gte = parseInt(minAge);
    if (maxAge) filter.age.$lte = parseInt(maxAge);

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const selectFields = excludeFields
      ? "-" + excludeFields.split(",").join(" -")
      : "-__v";

    const sortOptions = sortBy || "name";
    //usable without filters, first page, 10 per page
    //GET /api/v1/dogs
    //Returns first 10 dogs sorted by name.
    const dog = await Dog.find(filter)
      .populate("foodList", "foodtype flavor cost -_id")
      .select(selectFields)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      message: Messages.DOG_LIST,
      count: dog.length,
      page: pageNumber,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: Messages.INVALID_ID,
      });
    }
    const dog = await Dog.findById(id)
      .populate("foodList", "foodtype flavor cost -_id")
      .select("-__v");

    if (!dog) {
      return res.status(404).json({
        success: false,
        message: Messages.DOG_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      message: Messages.DOG_FOUND,
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

const createDog = async (req, res) => {
  try {
    const dogData = {
      ...req.body,
      foodList: req.body.foodList || [],
    };

    const dog = await Dog.create(dogData);
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
