const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// ========================
// Management View
// ========================
router.get("/", invController.buildManagement)

// ========================
// Add Classification
// ========================
router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
)

// ========================
// Add Inventory
// ========================
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
)

// ========================
// Get Inventory by Classification (JSON for AJAX)
// ========================
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// ========================
// Edit Inventory Item (Step 1 of update)
// ========================
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// ========================
// Update Inventory Item (Step 2 of update)
// ========================
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
