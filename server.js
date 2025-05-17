const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Homepage route
app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
