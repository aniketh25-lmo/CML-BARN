const mongoose = require('mongoose');

const excelSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('ExcelRow', excelSchema);