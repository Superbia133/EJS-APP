const express = require("express")
const baseController = require("./controllers/baseController")
const app = express()

// Set EJS as the view engine
app.set("view engine", "ejs")

// Serve static files from the public folder
app.use(express.static("public"))

// Home route using MVC controller
app.get("/", baseController.buildHome)

// Set and start the server
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
