const express = require("express");
const baseController = require("./controllers/baseController");
const staticRoutes = require("./routes/static"); // Import your router
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the public folder
app.use(express.static("public"));

// Middleware to parse form data (URL-encoded bodies)
app.use(express.urlencoded({ extended: true }));

// Use navigation builder if needed globally (optional)
// const utilities = require("./utilities");
// app.use(utilities.buildNav);

// Route for home page using baseController
app.get("/", baseController.buildHome);

// Use static route file for all other pages
app.use("/", staticRoutes);

// 500 Error Handler (Server errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", { title: "Server Error" });
});

// 404 Error Handler (Page not found)
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Page Not Found" });
});

// Set and start the server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
