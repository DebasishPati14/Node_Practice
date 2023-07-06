const path = require("path");
const fs = require("fs");
const { log } = require("console");

const productPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

module.exports = class Product {
  constructor(title, description, price, imageUrl, id) {
    this.id = id ? id : new Date().getTime();
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  saveProduct(productId) {
    fs.readFile(productPath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      if (productId) {
        products = products.map((prod) =>
          prod.id == productId ? (prod = this) : (prod = prod)
        );
      } else {
        products.push(this);
      }
      fs.writeFile(productPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAllProducts(callBack) {
    fs.readFile(productPath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      callBack(products);
    });
  }

  static getProductById(productId, callBack) {
    fs.readFile(productPath, (err, fileContent) => {
      let product = {};
      if (!err) {
        let products = JSON.parse(fileContent);
        product = products.find((prod) => {
          if (prod.id === +productId) {
            return prod;
          }
          console.log(prod.id);
        });
      }
      callBack(product);
    });
  }

  static deleteProduct(productId) {
    fs.readFile(productPath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
        products = products.filter((prod) => prod.id !== productId);
      }
      fs.writeFile(productPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
};
