const getDB = require("../utils/database").getDB;
const mongodb = require('mongodb');
const notifier = require('node-notifier');

module.exports = class Product {
  constructor(title, description, price, imageUrl, id,userId) {
    this._id = id ? new mongodb.ObjectId(id): new mongodb.ObjectId();
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.userId = new mongodb.ObjectId(userId)
  }

  saveProduct(productId) {
    const db = getDB();
    if (productId) {
      console.log({...this });
      db.collection("products").findOneAndUpdate({ _id:  this._id }, { $set: { ...this } }).then(result => {
        notifier.notify({
          title: 'Salutations!',
          message: JSON.stringify(result),
          sound: true,
          wait: true
        })
      }).catch(error => {
        throw error
      })

    } else {
      db.collection("products").insertOne(this).then(result => {
        notifier.notify({
          title: 'Salutations!',
          message: JSON.stringify(result),
          sound: true,
          wait: true
        })
      }).catch(error => {
        throw error
      })
    }
  }

  static fetchAllProducts(callBack) {
    const db = getDB();
    db.collection("products").find().toArray().then(response => {
      callBack(response)
    }).catch(err => {
      throw err
    })
  }

  static getProductById(productId, callBack) {
    const db = getDB();
    db.collection("products").findOne({ _id: new mongodb.ObjectId(productId) }).then(response => {
      callBack(response)
    }).catch(error => {
      throw error
    })
  }

  static deleteProduct(productId) {
    const db = getDB();
    db.collection("products").findOneAndDelete({ _id: new mongodb.ObjectId(productId) }).then(response => {
      notifier.notify({
        title: 'Salutations!',
        message: JSON.stringify(response, "product id: ", productId),
        sound: true,
        wait: true
      })
    }).catch(error => {
      throw error
    })
  }
};
