const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")

// Management view
router.get("/", invController.buildManagement)

// Add Classification
router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
)

module.exports = router
