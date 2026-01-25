//Import Dog model.
const Dog = require("../model/Dog");
//Import reusable response messages
const Messages = require("../../messages/messages");
//Import mongoose for ObjectId validation
const mongoose = require("mongoose");
const getAllDog = async (req, res) => {
  try {
    //Destructure query parameters
    const { breed, size, minAge, maxAge, excludeFields, sortBy, page, limit } =
      req.query;
    //filtering
    //filter by breed and size, age range, excluding filtering foodlist, sort by age, page 2, 5 per page:
    //GET /api/v1/dogs?breed=Labrador,Beagle&size=Medium,Small&minAge=2&maxAge=10&excludeFields=foodList&sortBy=age&page=2&limit=5
    //filters breed in [Labrador, Beagle], size in [Medium,Small], 2 <= age <= 10
    //exlcudes filtering foodlist field
    //sorts by age
    //pagination: page 2, 5 per page.

    //Build dynamic filter object
    let filter = {};
    //Filter by breed(s)
    if (breed) filter.breed = { $in: breed.split(",") };
    //Filter by size(s)
    if (size) filter.size = { $in: size.split(",") };
    //Filter by age range
    if (minAge || maxAge) filter.age = {};
    if (minAge) filter.age.$gte = parseInt(minAge);
    if (maxAge) filter.age.$lte = parseInt(maxAge);
    //Pagination logic
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    //Exlude specific fields or default to hiding __v
    const selectFields = excludeFields
      ? "-" + excludeFields.split(",").join(" -")
      : "-__v";
    //Sorting option (default: name)
    const sortOptions = sortBy || "name";
    //usable without filters, first page, 10 per page
    //GET /api/v1/dogs
    //Returns first 10 dogs sorted by name.
    //Query database
    const dog = await Dog.find(filter)
      .populate("foodList", "foodtype flavor cost -_id")
      .select(selectFields)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    //Successful response
    res.status(200).json({
      success: true,
      message: Messages.DOG_LIST,
      count: dog.length,
      page: pageNumber,
      data: dog,
    });
  } catch (error) {
    //Server error
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Get a single dog by ID
// GET /api/v1/dog/:id
const getDogById = async (req, res) => {
  try {
    const { id } = req.params;
    //Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: Messages.INVALID_ID,
      });
    }
    //  Find dog by ID
    const dog = await Dog.findById(id)
      .populate("foodList", "foodtype flavor cost -_id")
      .select("-__v");
    //Dog not found
    if (!dog) {
      return res.status(404).json({
        success: false,
        message: Messages.DOG_NOT_FOUND,
      });
    }
    //Success
    res.status(200).json({
      success: true,
      message: Messages.DOG_FOUND,
      data: dog,
    });
    //Server error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Create a new dog
//POST /api/v1/dog
const createDog = async (req, res) => {
  //Ensure foodList always exists.
  try {
    const dogData = {
      ...req.body,
      foodList: req.body.foodList || [],
    };
    //Create dog
    const dog = await Dog.create(dogData);
    //Success
    res.status(201).json({
      message: Messages.DOG_CREATED,
      success: true,
      data: dog,
    });
    //Server Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Update dog by ID
//PUT /api/v1/dog/:id
const updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    //Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    //Update dog
    const updatedDog = await Dog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");
    //  Dog not found
    if (!updatedDog) {
      return res.status(404).json({
        message: Messages.DOG_NOT_FOUND,
        success: false,
      });
    }
    //Success
    res.status(200).json({
      success: true,
      message: Messages.DOG_UPDATED,
      data: updatedDog,
    });
    //Server Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Delete a dog by ID
//DELETE /api/v1/dog/:id
const deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    //Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: Messages.INVALID_ID });
    }
    //Delete dog
    const deletedDog = await Dog.findByIdAndDelete(id).select("-__v");
    //Dog not found
    if (!deletedDog) {
      return res.status(404).json({
        success: false,
        message: Messages.DOG_NOT_FOUND,
      });
    }
    //Success
    res.status(200).json({
      message: Messages.DOG_DELETED,
      success: true,
      data: deletedDog,
    });
    //Server Error
  } catch (error) {
    res.status(500).json({
      success: false,
      message: Messages.SERVER_ERROR,
      error: error.message,
    });
  }
};
//Export controller functions
module.exports = {
  getDogById,
  getAllDog,
  createDog,
  updateDog,
  deleteDog,
};
