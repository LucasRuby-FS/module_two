const express = require("express");
const router = express.Router();
const foodRoutes = require("./foodRoutes");
const dogRoutes = require("./dogRoutes");
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `${req.method} Route request Made` });
});

router.use("/dog", dogRoutes);
router.use("/food", foodRoutes);
module.exports = router;
