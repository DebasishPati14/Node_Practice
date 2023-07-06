const fs = require("fs");
const path = require("path");

const productFile = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "product.json"
);

const getAllProducts = (callBack) => {
  fs.readFile(productFile, (err, fileContent) => {
    if (!err) {
      callBack(JSON.parse(fileContent));
    } else {
      callBack([]);
    }
  });
};

module.exports = class Product {
  constructor(id, title, price, imageUrl, description) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  saveProduct() {
    getAllProducts((product) => {
      if (this.id) {
        const productIndex = product.findIndex((prod) => prod.id === this.id);
        const allUpdatedProduct = [...product];
        allUpdatedProduct[productIndex] = this;
        fs.writeFile(productFile, JSON.stringify(allUpdatedProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        product.push(this);
        fs.writeFile(productFile, JSON.stringify(product), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteProduct(productId) {
    getAllProducts((product) => {
      const allUpdatedProduct = product.filter((prod) => prod.id !== productId);

      fs.writeFile(productFile, JSON.stringify(allUpdatedProduct), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAllProduct(callBack) {
    getAllProducts(callBack);
  }

  static fetchById(id, cb) {
    getAllProducts((products) => {
      const product = products.find((prod) => prod.id === id);
      if (product) {
        cb(product);
      } else {
        cb();
      }
    });
  }
};
