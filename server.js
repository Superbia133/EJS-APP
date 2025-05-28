const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const message = require("express-messages")
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const staticRoutes = require("./routes/static")
const accountRoutes = require("./routes/accountRoute")

const app = express()

// Set EJS as the view engine
app.set("view engine", "ejs")

// Serve static files from the public folder
app.use(express.static("public"))

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for form submissions

/* ***********************
 * Middleware for Sessions
 * *********************** */
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

/* ***********************
 * Middleware for Flash Messages
 * *********************** */
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = message(req, res)
  next()
})

// Route for home page
app.get("/", baseController.buildHome)

// Use static and account route files
app.use("/", staticRoutes)
app.use("/account", accountRoutes)

// 500 Error Handler (Server errors)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("errors/500", { title: "Server Error" })
})

// 404 Error Handler (Page not found)
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page Not Found" })
})

// Set and start the server
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
