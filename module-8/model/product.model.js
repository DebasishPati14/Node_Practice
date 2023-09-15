const fs = require('fs');
const path = require('path');

const productFile = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'product.json'
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
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  saveProduct() {
    getAllProducts((product) => {
      product.push(this);
      fs.writeFile(productFile, JSON.stringify(product), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAllProduct(callBack) {
    getAllProducts(callBack);
  }
};
