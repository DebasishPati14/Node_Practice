// const products = [];
const Product = require("../models/product.model");

exports.addProduct = (req, res, next) => {
  res.render("admin.ejs", { pageTitle: "Admin" });
};

exports.products = (req, res, next) => {
  console.log(req.body);
  let prods = new Product(req.body.productName);
  prods.saveProduct();

  res.redirect("/shop/message");
};

exports.message = (req, res, next) => {
  res.render("message.ejs", { pageTitle: "Message" });
};

exports.basePage = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    console.log(products);
    res.render("shop.ejs", {
      pageTitle: "Main",
      prods: products,
    });
  });
};

exports.pageNotFound = (req, resp, next) => {
  resp.send("Sorry Page Not Found");
};
