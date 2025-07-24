const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },

  phoneNumber: {
    type: String,
    match: /^[6-9]{1}[0-9]{9}$/, // Optional 10-digit Indian number format
    default: null
    // ⛔ Removed `unique: false` and `sparse: true` — they're unnecessary here.
  },

  password: {
    type: String,
    required: function () {
      return !this.isGoogleAccount;
    }
  },

  googleId: {
    type: String,
    default: null,
  },

  isGoogleAccount: {
    type: Boolean,
    default: false,
  },

  isAuthorized:  {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('Manager', managerSchema);
