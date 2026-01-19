const express = require("express");
const router = express.Router();
const dogRoutes = require("./dogRoutes");
const foodRoutes = require("./foodRoutes");

router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `${req.method} Request made` });
});

router.use("/dog", dogRoutes);
router.use("/food", foodRoutes);

module.exports = router;
