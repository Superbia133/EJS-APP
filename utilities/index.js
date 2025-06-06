const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = {}

/* ============================
   Navigation HTML Generator
============================ */
utilities.getNav = async function () {
  return `
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv/type/1">Custom</a></li>
      <li><a href="/inv/type/2">Sedan</a></li>
      <li><a href="/inv/type/3">SUV</a></li>
      <li><a href="/inv/type/4">Truck</a></li>
    </ul>
  `
}

/* ============================
   Async Error Handler
============================ */
utilities.handleErrors = function (fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ============================
   Middleware: JWT Verification
============================ */
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

/* ============================
   Middleware: Require Login
============================ */
utilities.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    res.redirect("/account/login")
  }
}

/* ============================
   Classification Grid Generator
============================ */
utilities.buildClassificationGrid = function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr>
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid = "<p class='notice'>Sorry, no matching vehicles could be found.</p>"
  }
  return grid
}

module.exports = utilities
