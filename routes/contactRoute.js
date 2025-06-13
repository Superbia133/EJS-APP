const express = require("express")
const router = new express.Router()
const contactController = require("../controllers/contactController")
const validate = require("../utilities/contact-validation")

router.get("/", contactController.buildContactForm)

router.post(
  "/",
  validate.messageRules(),
  validate.checkMessageData,
  contactController.handleContactSubmission
)

module.exports = router
