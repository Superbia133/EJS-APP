const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const message = require("express-messages")
const cookieParser = require("cookie-parser")
const pool = require("./database/")
const baseController = require("./controllers/baseController")
const staticRoutes = require("./routes/static")
const accountRoutes = require("./routes/accountRoute")
const inventoryRoutes = require("./routes/inventoryRoute")
const contactRoutes = require("./routes/contactRoute") // ✅ NEW: Contact route
const utilities = require("./utilities/")

const app = express()

// Set EJS as the view engine
app.set("view engine", "ejs")

// Serve static files from the public folder
app.use(express.static("public"))

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser for JWT
app.use(cookieParser())

// JWT middleware
app.use(utilities.checkJWTToken)

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

// Use route files
app.use("/", staticRoutes)
app.use("/account", accountRoutes)
app.use("/inv", inventoryRoutes)
app.use("/contact", contactRoutes) // ✅ NEW: Mount contact routes

// 500 Error Handler (Server errors)
app.use(async (err, req, res, next) => {
  console.error(err.stack)
  const nav = await utilities.getNav()
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: err.message,
    nav,
  })
})

// 404 Error Handler (Page not found)
app.use(async (req, res) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, the page you're looking for doesn't exist.",
    nav,
  })
})

// Set and start the server
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
