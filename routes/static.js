// routes/static.js
const express = require("express");
const router = express.Router();

// GET route for home page
router.get("/", (req, res) => {
  res.render("index"); // Make sure views/index.ejs exists
});

module.exports = router;