const client = require('../utils/twilio');

const sendCustomSMS = async (req, res) => {
  const { phoneNumber, phoneNumbers, message } = req.body;

  if ((!phoneNumber && (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0)) || !message) {
    return res.status(400).json({ error: 'Phone number(s) and message are required.' });
  }

  const rawRecipients = phoneNumbers || [phoneNumber];

  // Ensure +91 is prefixed
  const recipients = rawRecipients.map(num => {
    const cleaned = num.trim();
    return cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`;
  });

  const results = [];

  try {
    for (const number of recipients) {
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_NUMBER,
        to: number
      });
      results.push({ to: number, sid: result.sid });
    }

    return res.status(200).json({
      success: true,
      message: `Alerts sent to ${recipients.length} recipient(s).`,
      results
    });
  } catch (err) {
    console.error("❌ Error sending SMS via Twilio:", err.message);
    return res.status(500).json({ error: "Failed to send SMS", details: err.message });
  }
};

module.exports = {
  sendCustomSMS
};
