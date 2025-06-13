const contactModel = require("../models/contactModel")
const utilities = require("../utilities")

async function buildContactForm(req, res) {
  const nav = await utilities.getNav()
  res.render("contact/form", { title: "Contact Us", nav, errors: null, message: null })
}

async function handleContactSubmission(req, res) {
  const nav = await utilities.getNav()
  const { full_name, email, message } = req.body

  try {
    await contactModel.saveMessage(full_name, email, message)
    req.flash("notice", "Message sent successfully.")
    res.redirect("/")
  } catch (err) {
    console.error(err)
    res.render("contact/form", {
      title: "Contact Us",
      nav,
      errors: [{ msg: "Failed to send message." }],
      full_name,
      email,
      message
    })
  }
}

module.exports = { buildContactForm, handleContactSubmission }
