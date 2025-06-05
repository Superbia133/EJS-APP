'use strict'

// Get reference to the classification dropdown
let classificationList = document.querySelector("#classificationList")

// Listen for changes in the dropdown
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value
  console.log(`classification_id is: ${classification_id}`)

  let classIdURL = `/inv/getInventory/${classification_id}`

  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Network response was not OK.")
    })
    .then(function (data) {
      console.log(data)
      buildInventoryList(data)
    })
    .catch(function (error) {
      console.log("There was a problem:", error.message)
    })
})

// Build and inject table from inventory data
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay")

  // Table headers
  let dataTable = "<thead>"
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>"
  dataTable += "</thead>"

  // Table body
  dataTable += "<tbody>"
  data.forEach(function (vehicle) {
    console.log(`${vehicle.inv_id}, ${vehicle.inv_make} ${vehicle.inv_model}`)
    dataTable += `<tr><td>${vehicle.inv_make} ${vehicle.inv_model}</td>`
    dataTable += `<td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>`
    dataTable += `<td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td></tr>`
  })
  dataTable += "</tbody>"

  // Inject into the table in the view
  inventoryDisplay.innerHTML = dataTable
}
