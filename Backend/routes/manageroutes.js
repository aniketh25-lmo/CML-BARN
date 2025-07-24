const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authmiddleware');


const { registerManager, loginManager, googleRegister, googleLogin, forgotPassword, resetPassword, editManager, deleteManager, changePassword, getAllManagers, getManagerByEmail, updateManagerProfile } = require('../controllers/managerontroller');
const { addFarmer } = require('../controllers/farmercontroller');
// const { verifyAdminToken } = require('../middleware/authmiddleware');
const { validateManager, validateLogin, validateGoogle } = require('../middleware/schema');



router.post('/manager-register',validateManager, registerManager);
router.post('/manager-login',validateLogin, loginManager);
router.post('/add-farmer', addFarmer);
router.post('/google-register',validateGoogle, validateManager, googleRegister); // Assuming this is for Google registration
router.post('/google-login',validateGoogle, validateManager, googleLogin)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', protect, validateManager, changePassword);
router.put('/edit/:id',validateManager, editManager);
router.put('/edit',protect, validateManager, updateManagerProfile);      // PUT /api/manager/edit
// router.delete('/delete', deleteManager);
router.delete('/delete/:id', deleteManager);
router.get('/get-all-managers', getAllManagers);
router.get('/get-manager-by-email/:email', getManagerByEmail);

module.exports = router;
