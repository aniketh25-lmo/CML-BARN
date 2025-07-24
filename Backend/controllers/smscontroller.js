const client = require('../utils/twilio.js');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer.js');
const Session = require('../models/session.js');
dotenv = require('dotenv');
dotenv.config();

module.exports.sendOtp = async (req, res) => {
  let { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  const farmer = await Farmer.findOne({ phoneNumber: phoneNumber });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
  }
  phoneNumber = `+91${phoneNumber}`; // Ensure phone number is in E.164 format
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', verification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP, login using test otp: 123456', error: error.message });
  }
}

module.exports.verifyOtp = async (req, res) => {
  let { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }
  let farmerInfo = await Farmer.findOne({ phoneNumber: phoneNumber });
  const payload = {
    phoneNumber: farmerInfo.phoneNumber,
    aadharNumber: farmerInfo.aadharNumber,
    name: farmerInfo.fullName,
    _id: farmerInfo._id,
    role: 'farmer',
  }
// Add extra field
  phoneNumber = `+91${phoneNumber}`; // Ensure phone number is in E.164 format
  if (!farmerInfo) {
    return res.status(404).json({ message: 'Farmer not found' });
  }
  if (otp === '123456'){
    // For testing purposes, if OTP is hardcoded as 123456, we skip Twilio verification
    const farmerToken = jwt.sign( payload , process.env.JWT_SECRET, { expiresIn: '1h' });
    await Session.create({
      farmerId: farmerInfo._id,
      loginTime: new Date(),
      method: 'phone',
      role: 'farmer',
    });
    return res.status(200).json({ message: 'OTP verified successfully, Using test mode', farmerToken, payload: payload });
  }
  else {
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks
      .create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      const farmerToken = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await Session.create({
        farmerId: farmerInfo._id,
        loginTime: new Date(),
        method: 'phone',
        role: 'farmer',
      });

      res.status(200).json({ message: 'OTP verified successfully',farmerToken });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
  } 
}

module.exports.logoutFarmer = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const farmerToken = authHeader.split(' ')[1];

  try {
    // Decode token to extract phone number
    const decoded = jwt.verify(farmerToken, process.env.JWT_SECRET);
    const { phoneNumber } = decoded;
    // console.log("Decoded phone number:", phoneNumber);
    // Find the farmer associated with the phone number
    const farmer = await Farmer.findOne({ phoneNumber: phoneNumber });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Find the most recent session of this farmer
    const session = await Session.findOne({
      farmerId: farmer._id,
    }).sort({ loginTime: -1 });

    if (session) {
      session.logoutTime = new Date();
      await session.save();
    }

    // Optionally: inform client to delete the token
    res.status(200).json({ message: 'Logged out successfully', clearToken: true, });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
