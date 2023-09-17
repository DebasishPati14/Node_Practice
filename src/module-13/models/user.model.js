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
  this.cartProduct.totalPrice -=
    +price *
    this.cartProduct.products.find(
      (product) => (product) =>
        product.productId.toString() === productId.toString()
    ).quantity;
  this.cartProduct.products = this.cartProduct.products.filter(
    (product) => product.productId.toString() !== productId.toString()
  );

  return this.save();
};

module.exports = mongoose.model('User', userSchema);

/*
module.exports = class User {
  constructor(name, email, cartProducts, id) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.cartProducts = cartProducts;
  }

  save() {
    const db = getDB();
    db.collection('users')
      .insertOne(this)
      .then((result) => {
        notifier.notify({
          title: 'Salutations!',
          message: JSON.stringify(result),
          sound: true,
          wait: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static saveProductsInCart(productId, price, user, callBack) {
    const db = getDB();
    const productIndex = user.cartDetails?.products?.findIndex(
      (prod) =>
        new mongodb.ObjectId(prod.productId).toString() ===
        new mongodb.ObjectId(productId.toString()).toString()
    );
    let updatedProduct = user.cartDetails?.products || [];
    let updatedCart = {};
    if (productIndex >= 0) {
      updatedProduct = updatedProduct.map((product) =>
        new mongodb.ObjectId(product.productId).toString() ===
        new mongodb.ObjectId(productId).toString()
          ? {
              quantity: (updatedProduct[productIndex].quantity += 1),
              productId,
            }
          : product
      );
      updatedCart = {
        totalPrice: Number(user.cartDetails?.totalPrice || 0) + Number(price),
        products: updatedProduct,
      };
    } else {
      updatedProduct.push({ productId, quantity: 1 });
      updatedCart = {
        totalPrice: Number(user.cartDetails?.totalPrice || 0) + Number(price),
        products: updatedProduct,
      };
    }
    db.collection('users')
      .findOneAndUpdate(
        { _id: new mongodb.ObjectId(user._id) },
        { $set: { cartDetails: updatedCart } }
      )
      .then((result) => {
        callBack(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteProductFromCart(productId, price, callBack) {
    const db = getDB();
    db.collection('users')
      .findOne({ _id: this._id })
      .then((result) => {
        const updatedProduct = result.cartDetails.products.filter(
          (prod) => prod.productId !== productId
        );
        db.collection('users')
          .findOneAndUpdate(
            { _id: this._id },
            {
              $set: {
                cartDetails: {
                  products: updatedProduct,
                  totalPrice:
                    Number(result.cartDetails.totalPrice) - Number(price),
                },
              },
            }
          )
          .then((data) => {
            callBack(data);
          });
      });
  }

  getAllCartProducts(callBack) {
    const db = getDB();
    db.collection('users')
      .findOne({ _id: this._id })
      .then((result) => {
        getCartProducts(result.cartDetails?.products, (cb) => {
          const cartObject = {
            totalPrice: result.cartDetails?.totalPrice,
            products: cb,
          };
          callBack(cartObject || []);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findUserById(userId, callBack) {
    const db = getDB();
    db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((result) => {
        // notifier.notify({
        //     title: 'Salutations!',
        //     message: JSON.stringify(result),
        //     sound: true,
        //     wait: true
        // })
        callBack(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addOrder(callBack) {
    const db = getDB();
    this.getAllCartProducts((cartObject) => {
      db.collection('users')
        .findOneAndUpdate(
          { _id: this._id },
          {
            $set: { cartDetails: {} },
            $push: {
              orders: { $each: [cartObject] },
            },
          }
        )
        .then(() => {
          const userDetails = { userId: this._id, userName: this.name };
          db.collection('orders')
            .insertOne({
              ...cartObject,
              userDetails,
            })
            .then((result) => {
              callBack(result);
            });
        });
    });
  }

  getOrders(callBack) {
    const db = getDB();
    db.collection('orders')
      .find()
      .toArray()
      .then((allOrderDetails) => {
        const orderedProducts = [];
        allOrderDetails.forEach((orderDetail) => {
          if (
            new mongodb.ObjectId(orderDetail.userDetails.userId).toString() ===
            this._id.toString()
          ) {
            orderedProducts.push({
              eachOrderProducts: orderDetail.products,
              price: orderDetail.totalPrice,
            });
          }
        });
        callBack(orderedProducts);
      });
  }
};

const getCartProducts = (products, callBack) => {
  let updatedProducts = [];
  Product.fetchAllProducts((allProducts) => {
    updatedProducts =
      products &&
      products.map((item) => {
        return {
          ...allProducts.find(
            (prod) =>
              prod._id.toString() ===
              new mongodb.ObjectId(item.productId).toString()
          ),
          qty: item.quantity,
        };
      });
    callBack(updatedProducts);
  });
};
*/
