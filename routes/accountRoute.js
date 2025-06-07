const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to build registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process registration with validation
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login with validation
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Logout route
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

// Account management page (protected)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

// Build account update view
router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// Process account update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
