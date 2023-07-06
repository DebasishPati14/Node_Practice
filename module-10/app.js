const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRoute = require("./routes/admin.route");
const shopRoute = require("./routes/shop.route");
const path = require("path");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "./public/css")));

app.set("view engines", "views");
app.set("views", "views");

app.use("/shop", shopRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res, next) => {
  res.render("home.ejs", { path: "/", pageTitle: "Main Page" });
});

app.get("***", (req, res, next) => {
  res.render("404.ejs", { path: "404", pageTitle: "404 Page" });
});

app.listen(2400);
