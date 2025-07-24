const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/admincontroller');

router.post('/login', adminLogin);

module.exports = router;
