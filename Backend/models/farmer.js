const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, 
  enum : ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses', 'Other'],
  required: true },
  quantity: { type: Number },
  unit: { type: String },
}, { _id: false });

const livestockSchema = new mongoose.Schema({
  type: { type: String },
  count: { type: Number },
  rearingPractices: { type: String },
}, { _id: false });

const farmerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  cultivationPractices: {
    type: String,
  },
  landArea: {
    type: Number,
    required: true,
    min: 0
  },
  landUnit: {
    type: String,
    enum: ['acre', 'hectare'],
  },
  cropsSowing: [cropSchema],
  livestock: [livestockSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);
