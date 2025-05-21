const utilities = require("../../../Downloads/mvc_project/utilities")
const baseController = {}

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}

module.exports = baseController
