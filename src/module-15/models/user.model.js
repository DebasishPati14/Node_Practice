const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cartDetail: {
    totalPrice: { type: Number, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId, price) {
  const productIndex = this.cartDetail.products.findIndex(
    (prod) => prod.productId.toString() === productId.toString()
  );
  let updatedProduct = this.cartDetail.products || [];
  let updatedCart = {};
  if (productIndex >= 0) {
    updatedProduct = updatedProduct.map((product) =>
      product.productId.toString() === productId.toString()
        ? {
            quantity: (updatedProduct[productIndex].quantity += 1),
            productId,
          }
        : product
    );
  } else {
    updatedProduct.push({ productId, quantity: 1 });
  }
  updatedCart = {
    totalPrice: this.cartDetail?.totalPrice + +price,
    products: updatedProduct,
  };
  this.cartDetail = updatedCart;
  return this.save();
};

userSchema.methods.deleteProductFromCart = function (productId, price) {
  this.cartDetail.totalPrice -=
    +price *
    this.cartDetail.products.find(
      (product) => (product) =>
        product.productId.toString() === productId.toString()
    ).quantity;
  this.cartDetail.products = this.cartDetail.products.filter(
    (product) => product.productId.toString() !== productId.toString()
  );

  return this.save();
};

module.exports = mongoose.model('User', userSchema);
