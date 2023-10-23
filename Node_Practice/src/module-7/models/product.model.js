// const products = [];
const fs = require('fs');
const path = require('path');
const productFile = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getAppProducts = (callBack) => {
  fs.readFile(productFile, (err, fileContent) => {
    if (!err) {
      console.log(JSON.parse(fileContent), 'lop');
      callBack(JSON.parse(fileContent));
    } else {
      callBack([]);
    }
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  saveProduct() {
    getAppProducts((products) => {
      products.push(this);
      fs.writeFile(productFile, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAllProducts(callBack) {
    getAppProducts(callBack);
  }
};
