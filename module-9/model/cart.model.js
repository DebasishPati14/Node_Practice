const fs = require('fs')
const path = require('path')
const Product = require('./product.model')

const cartPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static saveIntoCart (id, price, cb) {
    fs.readFile(cartPath, (err, fileContent) => {
      let cartData = { products: [], totalAmount: 0 }
      if (!err) {
        cartData = JSON.parse(fileContent)
      }
      // check if product exist
      const productExistIndex = cartData.products.findIndex(
        (prod) => prod.id === id
      )
      const existingProduct = cartData.products[productExistIndex]

      if (existingProduct) {
        const updatedProds = [...cartData.products]
        updatedProds[productExistIndex].qty += 1
        cartData.products = updatedProds
        cartData.totalAmount = +cartData.totalAmount + +price
      } else {
        cartData.products.push({ id, qty: 1 })
        cartData.totalAmount = +cartData.totalAmount + +price
      }
      fs.writeFile(cartPath, JSON.stringify(cartData), (err) => {
        console.log(err + ' bh')
      })
      cb()
    })
  }

  static fetchCartProduct (cb) {
    const cartElements = []
    Product.fetchAllProduct((products) => {
      fs.readFile(cartPath, (err, fileContent) => {
        if (!err) {
          const cartItems = JSON.parse(fileContent)
          const cartProduct = cartItems.products
          cartProduct.forEach((item) => {
            const product = products.find((prod) => prod.id === item.id)
            product.quantity = item.qty
            cartElements.push(product)
          })
          cb(cartElements)
        }
      })
    })
  }

  static removeCartItem (productId, productPrice) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (!err) {
        const cartData = JSON.parse(fileContent)
        const removingProduct = cartData.products.find(
          (item) => item.id === productId
        )
        cartData.totalAmount =
          +cartData.totalAmount - +removingProduct.qty * +productPrice
        cartData.products = cartData.products.filter(
          (prod) => prod.id !== productId
        )
        fs.writeFile(cartPath, JSON.stringify(cartData), (err) => {
          console.log(err)
        })
      }
    })
  }
}
