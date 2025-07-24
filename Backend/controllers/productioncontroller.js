const Production = require('../models/production');

// @desc Get all production data
const getAllProduction = async (req, res) => {
  try {
    const data = await Production.find().sort({ year: 1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Add a new production entry
const addProduction = async (req, res) => {
  const { year, production } = req.body;
  if (!year || !production) return res.status(400).json({ error: 'Year and production are required' });

  try {
    const newEntry = new Production({ year, production });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add production data' });
  }
};

// @desc Update a production entry
const updateProduction = async (req, res) => {
  const { id } = req.params;
  const { year, production } = req.body;

  try {
    const updated = await Production.findByIdAndUpdate(id, { year, production }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Production not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update production data' });
  }
};

// @desc Delete a production entry
const deleteProduction = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Production.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Production not found' });
    res.json({ message: 'Production entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete production data' });
  }
};

module.exports = {
  getAllProduction,
  addProduction,
  updateProduction,
  deleteProduction
};
