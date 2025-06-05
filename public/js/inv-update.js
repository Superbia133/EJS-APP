'use strict'

const form = document.querySelector("#updateForm")

if (form) {
  const submitButton = form.querySelector("button[type='submit']")
  submitButton.setAttribute("disabled", true)

  form.addEventListener("input", function () {
    submitButton.removeAttribute("disabled")
  })
}
