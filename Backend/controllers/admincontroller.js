const jwt = require('jsonwebtoken');

const adminLogin = (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  // console.log(email, password)

  // Verify credentials against .env values
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      {
        role: 'admin',
        email: adminEmail,
        name: 'Administrator'
      },
      jwtSecret,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Admin login successful.',
      adminToken: token
    });
  }

  return res.status(401).json({ message: 'Invalid admin credentials.' });
};

module.exports = { adminLogin };
