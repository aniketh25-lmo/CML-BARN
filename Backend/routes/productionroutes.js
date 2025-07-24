const express = require('express');
const router = express.Router();
const {
  getAllProduction,
  addProduction,
  updateProduction,
  deleteProduction
} = require('../controllers/productioncontroller');

router.get('/', getAllProduction);
router.post('/', addProduction);
router.put('/:id', updateProduction);
router.delete('/:id', deleteProduction);

module.exports = router;
