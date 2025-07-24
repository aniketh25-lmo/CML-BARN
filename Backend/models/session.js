const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  loginTime: Date,
  logoutTime: Date,
  method: String,
  role: String, // 'farmer' or 'manager'
});

module.exports = mongoose.model('Session', sessionSchema);