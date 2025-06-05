const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* ===============================
   Classification Validation Rules
================================ */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters."),
  ]
}

/* ===============================
   Check Classification Validation Results
================================ */
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
    })
    return
  }
  next()
}

/* ===============================
   Inventory Validation Rules
================================ */
invValidate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative integer."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required."),
    body("classification_id")
      .isInt()
      .withMessage("A valid classification must be selected."),
  ]
}

/* ===============================
   Check Inventory Validation Results (Add)
================================ */
invValidate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    })
    return
  }
  next()
}

/* ===============================
   Check Inventory Validation Results (Update)
================================ */
invValidate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body, // Populate form with existing data including inv_id
    })
    return
  }
  next()
}

module.exports = invValidate
