const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  production: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true // optional: adds createdAt and updatedAt
});

module.exports = mongoose.model('Production', productionSchema);
