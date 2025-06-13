const { body, validationResult } = require("express-validator")

const messageRules = () => {
  return [
    body("full_name").trim().notEmpty().withMessage("Full name is required."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("message").trim().notEmpty().withMessage("Message is required.")
  ]
}

const checkMessageData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.body.errors = errors.array()
    return next("route")
  }
  next()
}

module.exports = { messageRules, checkMessageData }
