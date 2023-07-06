const express = require("express");
const app = express();
const path = require("path");
const adminRoute = require("./routes/admin.route");
const userRoute = require("./routes/shop.route");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public/css")));

app.set("view engines", "views");
app.set("views", "views");

app.use("/admin", adminRoute);
app.use("/shop", userRoute);

app.get("/", (req, res, next) => {
  res.render("index.ejs", { pageTitle: "index", path: "/" });
});

app.use("***", (req, res, next) => {
  res.render("404.ejs", { pageTitle: "404", path: "/***" });
});

app.listen(2400);
