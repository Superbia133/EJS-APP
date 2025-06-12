const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* Deliver login view */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* Deliver registration view */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* Process registration */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", { title: "Login", nav })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", { title: "Register", nav })
  }
}

/* Process login */
async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", { title: "Login", nav, account_email, errors: null })
  }

  const match = await bcrypt.compare(account_password, accountData.account_password)

  if (match) {
    delete accountData.account_password
    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    res.cookie("jwt", token, { httpOnly: true, secure: false, maxAge: 3600000 })
    return res.redirect("/account")
  } else {
    req.flash("notice", "Incorrect password.")
    res.status(400).render("account/login", { title: "Login", nav, account_email, errors: null })
  }
}

/* Logout */
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

/* Account management view */
async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    notice: req.flash("notice"),
    errors: null,
    accountData
  })
}

/* Deliver account update view */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  const accountId = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(accountId)

  res.render("account/account-update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

/* Handle account info update */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    res.cookie("jwt", token, { httpOnly: true, secure: false, maxAge: 3600000 })
    return res.redirect("/account")
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.status(500).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Update failed" }],
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* Handle password update */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account")
    } else {
      req.flash("notice", "Password update failed.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (err) {
    req.flash("notice", "An error occurred.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  logout,
  buildUpdateView,
  updateAccount,
  updatePassword
}
