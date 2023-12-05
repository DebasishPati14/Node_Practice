const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
  products: [{ type: Object, required: true }],
  totalPrice: { type: Object, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
