const express = require("express")
const router = new express.Router()
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

// Inventory management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(inventoryController.buildManagement)
)

// Add classification form
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.handleErrors(inventoryController.buildAddClassification)
)

// Process classification add
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
)

// Add inventory form
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.handleErrors(inventoryController.buildAddInventory)
)

// Process inventory add
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
)

// JSON endpoint for inventory by classification ID
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(inventoryController.getInventoryJSON)
)

// Edit inventory form
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(inventoryController.editInventoryView)
)

// Process inventory update
router.post(
  "/update/",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(inventoryController.updateInventory)
)

// View inventory by classification
router.get(
  "/type/:classification_id",
  utilities.handleErrors(inventoryController.buildByClassificationId)
)

// Detail view of a vehicle
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(inventoryController.buildDetailView)
)

module.exports = router
