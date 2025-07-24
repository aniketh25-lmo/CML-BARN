const express = require('express');
const router = express.Router();
const multer = require('multer');
const {uploadExcel, getExcelData, deleteExcelRow, updateExcelRow} = require('../controllers/filecontroller');

const upload = multer({ storage: multer.memoryStorage() });



router.post('/upload', upload.single('file'),uploadExcel);
router.get('/', getExcelData);
router.delete('/:id', deleteExcelRow);
router.put('/:id', updateExcelRow);

module.exports = router;