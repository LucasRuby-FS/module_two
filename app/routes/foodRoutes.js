const router = require("express").Router();
const {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require("../controller/foodController");

router.get("/", getAllFood);

router.get("/:id", getFoodById);

router.post("/", createFood);

router.put("/:id", updateFood);

router.delete("/:id", deleteFood);
module.exports = router;
