const express = require("express");
const router = express.Router();
const invController = require("../controllers/index"); // <-- Make sure this matches your controller filename

// GET route for home page
router.get("/", (req, res) => {
  res.render("index"); // Make sure views/index.ejs exists
});

// Vehicle Detail Page
router.get("/inventory/detail/:invId", invController.buildVehicleDetail);

// Trigger 500 Error (for testing)
router.get("/inventory/trigger-error", invController.triggerError);

module.exports = router;
