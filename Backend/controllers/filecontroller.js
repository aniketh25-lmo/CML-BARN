const ExcelRow = require('../models/excelrow');
const XLSX = require('xlsx');

// Upload Excel and Save to DB
module.exports.uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    await ExcelRow.insertMany(data);
    res.status(200).json({ message: 'Excel data saved to MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Data
module.exports.getExcelData = async (req, res) => {
  try {
    const data = await ExcelRow.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Record by ID
module.exports.deleteExcelRow = async (req, res) => {
  try {
    const { id } = req.params;
    await ExcelRow.findByIdAndDelete(id);
    res.status(200).json({ message: 'Row deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Record by ID
module.exports.updateExcelRow = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ExcelRow.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
