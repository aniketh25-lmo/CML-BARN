const express = require('express');
const router = express.Router();
const { addFarmer, updateFarmer, getFarmerByAadhar, getFarmers, deleteFarmer } = require('../controllers/farmercontroller');
const { sendOtp, verifyOtp, logoutFarmer } = require('../controllers/smscontroller');
const { sendCustomSMS } = require('../controllers/smsNotificationController');
const { farmerValidation } = require('../middleware/schema');
const { validationResult } = require('express-validator');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });a
  }
  next();
};

router.post('/farmer-sign', farmerValidation, runValidation, addFarmer);

router.get('/get/:aadharNumber', getFarmerByAadhar);

router.put('/update/:aadharNumber', farmerValidation, runValidation, updateFarmer);

router.delete('/delete/:aadharNumber', deleteFarmer);

router.get('/get', getFarmers);

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.post('/alert', sendCustomSMS);

router.post('/farmer-logout', logoutFarmer);

module.exports = router;