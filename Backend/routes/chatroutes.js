const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatcontroller');
const {chatMessageValidator} = require('../middleware/schema');

router.post('/send', chatMessageValidator, sendMessage);
router.get('/messages', getMessages);

module.exports = router;
