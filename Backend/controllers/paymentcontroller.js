const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/donation');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
const createOrder = async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount || amount < 300) {
    return res.status(400).json({ message: 'Invalid name or amount (min ₹300).' });
  }

  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// POST /api/payment/verify-payment
const verifyDonation = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    contact,
    amount,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !name ||
    !email ||
    !contact ||
    !amount
  ) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed.' });
  }

  try {
    const donation = new Donation({
      name,
      email,
      contact,
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    await donation.save();

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: `"CML's BARN - Donation Team" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🎉 Thank You for Your Donation!',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: green;">Thank you, ${name}!</h2>
          <p>We’ve received your donation of <strong>₹${amount}</strong>.</p>
          <p><strong>Transaction ID:</strong> ${razorpay_payment_id}</p>
          <p>Your support means a lot to us. 🙏</p>
          <br/>
          <p style="color: gray;">— Donation Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Payment verified and donation recorded successfully.' });
  } catch (err) {
    console.error('Donation save or email error:', err);
    res.status(500).json({ message: 'Payment verified, but failed to save donation or send email.' });
  }
};

// GET /api/payment/donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ message: 'Failed to fetch donations.' });
  }
};

module.exports = {
  createOrder,
  verifyDonation,
  getAllDonations,
};
