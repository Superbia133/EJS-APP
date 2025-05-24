const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildVehicleDetail(req, res, next) {
  try {
    const invId = parseInt(req.params.invId);
    const vehicle = await invModel.getVehicleById(invId);

    if (!vehicle) {
      return res.status(404).render("errors/404", { title: "Vehicle Not Found" });
    }

    const html = utilities.buildVehicleDetailHTML(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      html,
    });
  } catch (err) {
    next(err);
  }
}

function triggerError(req, res, next) {
  throw new Error("Intentional error for testing middleware.");
}

module.exports = {
  buildVehicleDetail,
  triggerError,
};
