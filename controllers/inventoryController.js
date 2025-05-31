const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

/* ========================
   Build Management View
======================== */
async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: req.flash("message"),
  })
}

/* ========================
   Build Add Classification View
======================== */
async function buildAddClassification(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ========================
   Process Add Classification
======================== */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
    })
  }

  const addResult = await invModel.insertClassification(classification_name)

  if (addResult) {
    req.flash("message", `The ${classification_name} classification was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("message", "Sorry, the insert failed.")
    res.redirect("/inv/add-classification")
  }
}

/* ========================
   Build Add Inventory View
======================== */
async function buildAddInventory(req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  })
}

/* ========================
   Process Add Inventory
======================== */
async function addInventory(req, res) {
  let nav = await utilities.getNav()
  const errors = validationResult(req)

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  let classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }

  const addResult = await invModel.insertInventory({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  })

  if (addResult) {
    req.flash("message", `${inv_make} ${inv_model} was successfully added.`)
    res.redirect("/inv")
  } else {
    req.flash("message", "Sorry, the insert failed.")
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: [{ msg: "Insert failed, please try again." }],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
  }
}

module.exports = {
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
}
