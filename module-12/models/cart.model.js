const getDB = require("../utils/database").getDB;
const notifier = require('node-notifier');
const mongodb = require('mongodb')

module.exports = class Cart {
  static async saveProductInCart(id, price, callBack) {
    const db = getDB();
    const response = await db.collection("cart").find().toArray()
    const cartData = response[0];

    if (cartData) {
      db.collection("cart").findOneAndUpdate({ _id: cartData._id }, { $set: Cart.setCartProduct(id, +price, cartData) }).then(result => {
        notifier.notify({
          title: 'Salutations!',
          message: JSON.stringify(result),
          sound: true,
          wait: true
        });
        callBack(result)
      }).catch(error => {
        console.log(error);
      })
    } else {
      db.collection("cart").insertOne({ totalPrice: price, products: [{ id: id, qty: 1 }] }).then(result => {
        notifier.notify({
          title: 'Salutations!',
          message: JSON.stringify(result),
          sound: true,
          wait: true
        });
                callBack(result)
      }).catch(error => {
        console.log(error);
      })
    }

  }

  static setCartProduct(id, price, cartData) {
    let productExist = false;
    let updatedCartData = cartData;

    cartData.products.forEach(prod => {
      console.log("prod:id", prod.id, "provided :id", id);
      console.log("prod:id", prod.id == id);

      if (prod.id === id) {
        productExist = true
      }
    })

    if (productExist) {
      updatedCartData = {
        totalPrice: +cartData.totalPrice + price,
        products: cartData.products.map((prod) => {
          return prod.id == id ? { ...prod, qty: prod.qty + 1 } : prod
        })
      }
    } else {
      updatedCartData.totalPrice += price,
        updatedCartData.products.push({ id, qty: 1 })
    }
    return updatedCartData
  }


  async getCartProducts(callBack) {
    const db = getDB();
    const cartProducts = [];
    const cartData = await db.collection("cart").find().toArray();
    const allProducts = await db.collection("products").find().toArray();

    cartData[0].products.forEach(prod => {
      cartProducts.push({
        ...allProducts.find((eachItem) => eachItem._id == prod.id),
        qty: prod.qty
      })
    })
    callBack({products:cartProducts,totalPrice:cartData && cartData[0].totalPrice})
  }

  async deleteItemFromCart(productId, price, callBack) {
    const db = getDB();
    const response = await db.collection("cart").find().toArray();
    let cartData = response[0];

    const getUpdatedProduct = (cartData) => {
      return cartData.products.filter(prod => prod.id != productId);
    }

    db.collection("cart").findOneAndUpdate(
      { _id: cartData._id },
      {
        $set: {
          totalPrice: +cartData.totalPrice - +price,
          products: getUpdatedProduct(cartData)
        }
      }
    ).then(result => {

      notifier.notify({
        title: 'Salutations!',
        message: JSON.stringify(result),
        sound: true,
        wait: true
      })
    }).catch(err => {
      console.error(err);
    });
  }

};
