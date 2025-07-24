const express = require('express');
const router = express.Router();
// const { createOrder, verifyPayment, getAllDonations } = require('../controllers/paymentcontroller');
const { donationValidator }  = require('../middleware/schema');
// const { validationResult } = require('express-validator');
const {createOrder, verifyDonation, getAllDonations} = require('../controllers/paymentcontroller')

// const runValidation = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }
//   next();
// };

router.post('/create-order', donationValidator, createOrder);
router.post('/verify-payment', verifyDonation);
// router.post('/save-donation', paymentController.saveDonation);
router.get('/all-donations', getAllDonations);

module.exports = router;