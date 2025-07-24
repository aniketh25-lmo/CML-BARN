const Product = require('../models/product');
const Farmer = require('../models/farmer');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const Order = require('../models/order');
const nodemailer = require('nodemailer');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Add Product
const addProduct = async (req, res) => {
  const { aadharNumber, name, category, quantity, pricePerUnit, description, image, cloudinaryId } = req.body;

  if (!aadharNumber || !name || !category || quantity == null || pricePerUnit == null) {
    return res.status(400).json({ message: 'Missing required product fields.' });
  }

  try {
    const farmer = await Farmer.findOne({ aadharNumber });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    const product = new Product({
      farmerId: farmer._id,
      farmerName: farmer.fullName,
      aadharNumber,
      name,
      category,
      quantity,
      pricePerUnit,
      description: description || '',
      image: image || '',
      cloudinaryId: cloudinaryId || '',
    });

    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err);
    return res.status(500).json({ message: 'Failed to add product' });
  }
};

// 2. Edit Product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, pricePerUnit, description, image, aadharNumber, cloudinaryId } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ message: 'Aadhar number is required' });
  }

  try {
    const farmer = await Farmer.findOne({ aadharNumber });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    if (
      existingProduct.cloudinaryId &&
      cloudinaryId &&
      existingProduct.cloudinaryId !== cloudinaryId
    ) {
      await cloudinary.uploader.destroy(existingProduct.cloudinaryId);
      console.log(`Old image deleted: ${existingProduct.cloudinaryId}`);
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        quantity,
        pricePerUnit,
        description,
        image,
        cloudinaryId: cloudinaryId || '',
        aadharNumber,
        farmerName: farmer.fullName,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Edit product error:', err);
    return res.status(500).json({ message: 'Failed to update product' });
  }
};

// 3. Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
      console.log(`Deleted Cloudinary image: ${product.cloudinaryId}`);
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Product and image deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};

// 4. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// 5. Create Razorpay Order
const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ message: 'Invalid payment amount' });
  }

  try {
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.error('Create Razorpay order error:', err);
    return res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// 6. Save Order after Payment
const saveOrder = async (req, res) => {
  const {
    buyerName,
    buyerEmail,
    buyerAddress,
    phoneNumber,
    sellerName,
    productName,
    quantityBought,
    amountPaid,
    orderId,
    paymentId,
  } = req.body;

  if (
    !buyerName ||
    !buyerEmail ||
    !buyerAddress ||
    !phoneNumber ||
    !sellerName ||
    !productName ||
    !quantityBought ||
    !amountPaid ||
    !orderId ||
    !paymentId
  ) {
    return res.status(400).json({ message: 'Missing required order fields.' });
  }

  try {
    const product = await Product.findOne({ name: productName });

    if (!product || product.quantity < quantityBought) {
      return res.status(400).json({ message: 'Not enough stock available.' });
    }

    product.quantity -= quantityBought;
    if (product.quantity <= 0) {
      product.quantity = 0;
      product.isSold = true;
    }

    await product.save();

    const newOrder = new Order({
      buyerName,
      buyerEmail,
      buyerAddress,
      phoneNumber,
      sellerName,
      productName,
      quantityBought,
      amountPaid,
      orderId,
      paymentId,
    });

    await newOrder.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CML's BARN - Market" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: "Order Confirmation - CML's BARN",
      html: `
        <h2>Thank you for your order, ${buyerName}!</h2>
        <p>Your order has been placed successfully. Here are your order details:</p>
        <ul>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Quantity:</strong> ${quantityBought}</li>
          <li><strong>Amount Paid:</strong> ₹${amountPaid}</li>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Payment ID:</strong> ${paymentId}</li>
          <li><strong>Delivery Address:</strong> ${buyerAddress}</li>
        </ul>
        <p>We will notify you when your order is shipped.</p>
        <br/>
        <p>Regards,<br/><strong>AgroMarket Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending confirmation email:', err);
      } else {
        console.log('Confirmation email sent:', info.response);
      }
    });

    return res.status(201).json({ message: '✅ Order placed and email sent successfully!' });
  } catch (err) {
    console.error('Save order error:', err);
    return res.status(500).json({ message: 'Error saving the order after payment.' });
  }
};

// 7. Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  createOrder,
  saveOrder,
  getAllOrders, // ✅ Exported
};
