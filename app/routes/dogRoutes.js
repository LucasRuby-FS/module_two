const router = require("express").Router();

const {
  getAllDog,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
} = require("../controller/dogController");

router.get("/", getAllDog);

router.get("/:id", getDogById);

router.post("/", createDog);

router.put("/:id", updateDog);

router.delete("/:id", deleteDog);

module.exports = router;
