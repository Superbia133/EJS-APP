const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = {}

// Dummy example for getNav() - update according to your database
utilities.getNav = async function () {
  return `<ul><li><a href="/">Home</a></li><li><a href="/account">Account</a></li><li><a href="/inv">Inventory</a></li></ul>`
}

// Middleware: check for valid JWT
utilities.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) return next()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("jwt")
      return next()
    }
    res.locals.accountData = decoded
    res.locals.loggedin = true
    next()
  })
}

// Middleware: protect route
utilities.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    res.redirect("/account/login")
  }
}

module.exports = utilities
