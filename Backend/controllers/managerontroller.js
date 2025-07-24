const Manager = require('../models/manager');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Session = require('../models/session');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
// };
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'postmessage' // for OAuth2 Code flow from frontend
});

const registerManager = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  const existing = await Manager.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Manager already exists' });

  const manager =  new Manager({ name, email, phoneNumber, password, isGoogleAccount: false });
  await manager.save();


  res.status(201).json({
    message: 'Manager registered successfully',
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      phoneNumber: manager.phoneNumber,
      // isGoogleAccount: false
    }
  });
};

const loginManager = async (req, res) => {
  const { email, password } = req.body;

  const manager = await Manager.findOne({ email });
  // console.log(manager)
  if (!manager) {
    return res.status(404).json({ message: 'Manager not found' });
  }

  const isMatch = bcrypt.compareSync(password, manager.password);
  // console.log(isMatch)
  if (isMatch) {
     
    const payload = {
    id: manager._id,
    name: manager.name,
    email: manager.email,
    phoneNumber: manager.phoneNumber,
    role: 'manager',
    isAuthorized: manager.isAuthorized,
    isGoogleAccount: manager.isGoogleAccount
  };
  // console.log(payload)
  // ✅ Create session
  await Session.create({
    managerId: manager._id,
    loginTime: new Date(),
    method: 'email',
    role: 'manager',
    });

  // ✅ Sign the token
  const managerToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // ✅ Send token in response
  res.status(200).json({ message: 'Login successfull',managerToken, payload: payload });
    }
    
   else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};



const googleRegister = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'No authorization code provided.' });

    // Exchange auth code for tokens
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    // Verify ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload_1 = ticket.getPayload();
    const { email, name, sub: googleId } = payload_1;

    // Check if the manager already exists
    let manager = await Manager.findOne({ email });

    if (!manager) {
      // Create new manager if not found
      manager = new Manager({
        name,
        email,
        googleId,
        password : '',
        isGoogleAccount: true,
      });
      await manager.save();
    }

    // Generate JWT
    const payload = {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: 'manager',
      isAuthorized: manager.isAuthorized,
      isGoogleAccount: manager.isGoogleAccount,
    };

    const managerToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    await Session.create({
            managerId: manager._id,
            loginTime: new Date(),
            method: 'google',
            role: 'manager',
          });

    return res.status(200).json({
      success: true,
      message: 'Google registration/login successful',
      managerToken, 
      payload: payload
    });

  } catch (error) {
    console.error('❌ Google OAuth Error:', error);
    return res.status(500).json({ success: false, message: 'Google registration failed' });
  }
};


const googleLogin = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Missing authorization code.' });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload_1 = ticket.getPayload();
    const { email, name, googleId } = payload_1;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Invalid Google payload.' });
    }

    // Check if manager already exists
    let manager = await Manager.findOne({ email });

    if (!manager) {
      // Create new manager (Google accounts won't have password/phoneNumber)
      manager = new Manager({
        name,
        email,
        googleId,
        password: '',
        isGoogleAccount: true,
      });
      await manager.save();
    }

    const payload = {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: 'manager',
      isAuthorized: manager.isAuthorized,
      isGoogleAccount: manager.isGoogleAccount
    };

    const managerToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    await Session.create({
            managerId: manager._id,
            loginTime: new Date(),
            method: 'google',
            role: 'manager',
          });

    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      managerToken,
      payload: payload,
    });
  } catch (err) {
    console.error('🔴 Google Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: err.message,
    });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found with this email.' });
    }

    const resetToken = jwt.sign({ id: manager._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_RESET_EXPIRY || '15m',
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const subject = "Password Reset Request - CML's BARN";
    const html = `
      <h4>Hi ${manager.name || 'Manager'},</h4>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" target="_blank" style="color: blue;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Regards,<br/>CML's BARN Team</p>
    `;

    await sendEmail({
      to: manager.email,
      subject,
      html,
    });

    res.json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending reset email.' });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const manager = await Manager.findById(decoded.id);

    if (!manager) {
      return res.status(404).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    manager.password = hashedPassword;
    await manager.save();

    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};


// ✅ Edit Manager Profile Admin

const editManager = async (req, res) => {
  const { id } = req.params; // Get manager ID from route parameter
  const { name, phoneNumber, email, isAuthorized } = req.body;

  try {
    // Build update object dynamically
    const updateFields = {
      ...(name && { name }),
      ...(phoneNumber && { phoneNumber }),
      ...(email && { email }),
    };

    // Only add isAuthorized if it's explicitly provided (true or false)
    if (typeof isAuthorized === 'boolean') {
      updateFields.isAuthorized = isAuthorized;
    }

    const manager = await Manager.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({
      message: 'Manager updated successfully',
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        phoneNumber: manager.phoneNumber,
        isAuthorized: manager.isAuthorized,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update manager' });
  }
};

// Edit by manager

const updateManagerProfile = async (req, res) => {
  try {
    const email = req.user?.email; // Safe access

    if (!email) {
      return res.status(401).json({ message: "Unauthorized: No user email" });
    }

    const { name, phoneNumber } = req.body;
    // console.log("Update Profile Request:", req.body, email);
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: "Name is required and must be a string" });
    }

    // Build the update object dynamically
    const updateFields = { name };
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;

    const updatedManager = await Manager.findOneAndUpdate(
      { email },
      updateFields,
      { new: true, runValidators: true }
    );
    // console.log("Updated Manager:", updatedManager);

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json({ manager: updatedManager });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};


// ✅ Delete Manager
const deleteManager = async (req, res) => {
  const { id } = req.params; // Get manager ID from route parameter

  try {
    const manager = await Manager.findByIdAndDelete(id);

    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ message: 'Manager deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete manager' });
  }
};


const changePassword = async (req, res) => {
  const managerId = req.user.id; // from auth middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const manager = await Manager.findById(managerId);

    if (!manager || !manager.password) {
      return res.status(401).json({ message: 'Not authorized to change password' });
    }

    const isMatch = await manager.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    manager.password = await bcrypt.hash(newPassword, salt);
    await manager.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().select('-password');
    res.status(200).json({ success: true, managers });
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch managers' });
  }
};

const getManagerByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const manager = await Manager.findOne({ email }).select('-password');
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found' });

    res.status(200).json({ success: true, manager });
  } catch (error) {
    console.error('Error fetching manager by email:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch manager' });
  }
};

// ------------------ ✅ EXPORT ------------------

module.exports = {
  registerManager,
  loginManager,
  googleRegister,
  googleLogin,
  forgotPassword,
  resetPassword,
  editManager,
  updateManagerProfile,
  deleteManager,
  changePassword,
  getAllManagers,
  getManagerByEmail
};

