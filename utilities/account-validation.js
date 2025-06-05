const { body, validationResult } = require("express-validator")
const utilities = require(".")

const accValidate = {}

/* ===============================
   Registration Validation Rules
================================ */
accValidate.registrationRules = () => {
  return [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("last_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
  ]
}

/* ===============================
   Check Registration Validation Results
================================ */
accValidate.checkRegData = async (req, res, next) => {
  const { first_name, last_name, email } = req.body
  let errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      first_name,
      last_name,
      email
    })
    return
  }
  next()
}

/* ===============================
   Login Validation Rules
================================ */
accValidate.loginRules = () => {
  return [
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
  ]
}

/* ===============================
   Check Login Validation Results
================================ */
accValidate.checkLoginData = async (req, res, next) => {
  const { email } = req.body
  let errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      email
    })
    return
  }
  next()
}

module.exports = accValidate
