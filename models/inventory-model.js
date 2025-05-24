const pool = require("../database");

// Get all classifications
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

// Get one vehicle by ID
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return result.rows[0]; // Return just the object, not the array
  } catch (error) {
    throw new Error("Failed to fetch vehicle from database.");
  }
}

module.exports = {
  getClassifications,
  getVehicleById,
};
