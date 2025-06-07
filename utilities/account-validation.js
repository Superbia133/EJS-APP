const { body, validationResult } = require("express-validator")
const utilities = require(".")

const accValidate = {}

/* ===============================
   Registration Validation Rules
================================ */
accValidate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
  ]
}

/* ===============================
   Check Registration Validation Results
================================ */
accValidate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email
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
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
  ]
}

/* ===============================
   Check Login Validation Results
================================ */
accValidate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email
    })
    return
  }
  next()
}

/* ===============================
   Account Update Validation Rules
================================ */
accValidate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
  ]
}

/* ===============================
   Check Update Validation Results
================================ */
accValidate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    res.render("account/account-update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
    return
  }
  next()
}

/* ===============================
   Password Update Validation Rules
================================ */
accValidate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
      .withMessage(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      )
  ]
}

/* ===============================
   Check Password Validation Results
================================ */
accValidate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const accountData = await require("../models/account-model").getAccountById(account_id)

  if (!errors.isEmpty()) {
    res.render("account/account-update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
    return
  }
  next()
}

module.exports = accValidate
