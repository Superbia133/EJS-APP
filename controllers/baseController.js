const baseController = {}

baseController.buildHome = function (req, res) {
  res.render("index", { title: "Home" })
}

module.exports = baseController
