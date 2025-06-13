const pool = require("../database/")

async function saveMessage(full_name, email, message) {
  try {
    const sql = `INSERT INTO contact_messages (full_name, email, message) VALUES ($1, $2, $3) RETURNING *`
    const data = await pool.query(sql, [full_name, email, message])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = { saveMessage }
