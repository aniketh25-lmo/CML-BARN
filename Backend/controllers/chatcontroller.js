const ChatMessage = require('../models/chat');
const { validationResult } = require('express-validator');

const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation failed:', errors.array()); // ✅ Better logging
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { senderName, senderRole, message } = req.body;

  try {
    const newMessage = new ChatMessage({ senderName, senderRole, message });
    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
