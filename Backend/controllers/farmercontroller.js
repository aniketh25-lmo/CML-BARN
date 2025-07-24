const Farmer = require('../models/farmer');

// Add a new farmer
exports.addFarmer = async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    const savedFarmer = await farmer.save();
    res.status(201).json(savedFarmer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all farmers
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a farmer by Aadhar number
exports.getFarmerByAadhar = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ aadharNumber: req.params.aadharNumber });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a farmer by Aadhar number
exports.updateFarmer = async (req, res) => {
  try {
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { aadharNumber: req.params.aadharNumber },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFarmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(updatedFarmer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a farmer by Aadhar number
exports.deleteFarmer = async (req, res) => {
  try {
    const deletedFarmer = await Farmer.findOneAndDelete({ aadharNumber: req.params.aadharNumber });
    if (!deletedFarmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: 'Farmer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};