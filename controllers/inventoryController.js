const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

/* ========================
   Build Management View
======================== */
async function buildManagement(req, res) {
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    classificationList,
    errors: null,
    message: req.flash("message"),
  })
}

/* ========================
   Build Add Classification View
======================== */
async function buildAddClassification(req, res) {
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    errors: null,
  })
}

/* ========================
   Process Add Classification
======================== */
async function addClassification(req, res) {
  const { classification_name } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
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
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
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

/* ========================
   Return Inventory by Classification As JSON
======================== */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0]?.inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ========================
   Build Edit Inventory View
======================== */
async function editInventoryView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ========================
   Process Inventory Update
======================== */
async function updateInventory(req, res, next) {
  const errors = validationResult(req)

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    const itemName = `${inv_make} ${inv_model}`
    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      classificationList,
      errors: errors.array(),
      inv_id,
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
  }

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash("message", `The ${itemName} was successfully updated.`)
    res.redirect("/inv")
  } else {
    req.flash("message", "Sorry, the update failed.")
    const itemName = `${inv_make} ${inv_model}`
    res.status(500).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      classificationList,
      errors: [{ msg: "Update failed. Please try again." }],
      inv_id,
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
  }
}

/* ========================
   Build Classification View
======================== */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const className = data[0]?.classification_name || "Vehicles"
  const grid = await utilities.buildClassificationGrid(data)

  res.render("inventory/classification", {
    title: `${className} Vehicles`,
    grid,
  })
}

/* ========================
   Build Detail View (Assignment 3)
======================== */
async function buildDetailView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  try {
    const data = await invModel.getInventoryById(inv_id)
    if (!data || !data.inv_id) {
      throw new Error("Vehicle not found")
    }

    const itemName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    const detailHtml = utilities.buildVehicleDetailHTML(data)

    res.render("inventory/detail", {
      title: itemName,
      html: detailHtml,
    })
  } catch (err) {
    next(err)
  }
}

/* ========================
   Trigger Intentional Error (Assignment 3)
======================== */
function triggerError(req, res, next) {
  throw new Error("This is a test 500 error.")
}

module.exports = {
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  getInventoryJSON,
  editInventoryView,
  updateInventory,
  buildDetailView,
  buildByClassificationId,
  triggerError,
}
