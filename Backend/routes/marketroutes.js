const express = require('express');
const router = express.Router();
const {
  addProduct,
  editProduct,
  getAllProducts,
  createOrder,
  deleteProduct,
  saveOrder,
  getAllOrders
} = require('../controllers/marketcontroller');
const { validateProduct } = require('../middleware/schema');

// Add product
router.post('/add', validateProduct, addProduct);

// Edit product
router.put('/update/:id', validateProduct, editProduct);

// Get all products (public)
router.get('/all', getAllProducts);

// Razorpay order creation (before payment)
router.post('/purchase/create-order', createOrder);

// Razorpay payment verification (after success)
router.post('/purchase/verify-payment', saveOrder);

router.delete('/delete/:id', deleteProduct);

router.get('/orders', getAllOrders);

module.exports = router;
