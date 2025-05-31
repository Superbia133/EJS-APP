const pool = require("../database")

// Get all classifications
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

// Get one vehicle by ID
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error("Failed to fetch vehicle from database.")
  }
}

// Insert a new classification
async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("Error inserting classification:", error)
    return null
  }
}

// Insert a new inventory item
async function insertInventory(vehicle) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const values = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_year,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.inv_price,
      vehicle.inv_miles,
      vehicle.inv_color,
      vehicle.classification_id,
    ]
    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("Error inserting inventory:", error)
    return null
  }
}

module.exports = {
  getClassifications,
  getVehicleById,
  insertClassification,
  insertInventory,
}
