const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerEmail: {
    type: String,
    required: true,
    trim: true
  },
  buyerAddress: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  sellerName: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantityBought: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
