const fs = require("fs");
const path = require("path");
const Product = require("./product.model");
const { log } = require("console");

const cartPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static saveProductInCart(id, price, callBack) {
    fs.readFile(cartPath, (error, fileContent) => {
      let cartData = {};
      let productExist = undefined;
      if (!error && fileContent.length) {
        cartData = JSON.parse(fileContent);
        productExist =
          cartData.products &&
          cartData.products.find((item) => +item.id === +id);
        if (productExist) {
          cartData.products = cartData.products.map((item) => {
            if (item.id == id) {
              return { qty: Number(item.qty) + 1, id: item.id };
            } else {
              return (item = item);
            }
          });
          cartData.totalPrice = Number(cartData.totalPrice) + Number(price);
        } else {
          cartData.products.push({ id: id, qty: 1 });
          cartData.totalPrice = Number(cartData.totalPrice) + Number(price);
        }
      } else {
        cartData = { products: [{ id: id, qty: 1 }], totalPrice: +price };
      }
      fs.writeFile(cartPath, JSON.stringify(cartData), (err) => {
        console.log(err);
        callBack(cartData);
      });
    });
  }

  getCartProducts(callBack) {
    fs.readFile(cartPath, (err, fileContent) => {
      const cartProducts = [];
      if (!err) {
        Product.fetchAllProducts((products) => {
          let cartItems = JSON.parse(fileContent).products;
          cartItems.forEach((prod) => {
            cartProducts.push({
              ...products.find((eachItem) => eachItem.id == prod.id),
              qty: prod.qty,
            });
          });
          console.log(cartItems);
          callBack(cartProducts);
        });
      } else {
        callBack([cartProducts]);
      }
    });
  }

  deleteItemFromCart(productId, price) {
    fs.readFile(cartPath, (err, fileContent) => {
      let cartProducts = [];
      let updatedProducts = {};
      if (!err) {
        cartProducts = JSON.parse(fileContent).products;
        updatedProducts.totalPrice =
          JSON.parse(fileContent).totalPrice -
          +cartProducts.find((prod) => prod.id == productId).qty * +price;
        cartProducts = cartProducts.filter((prod) => prod.id !== productId);
        updatedProducts.products = cartProducts;
      }
      fs.writeFile(cartPath, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
      console.table(updatedProducts);
    });
  }
};
