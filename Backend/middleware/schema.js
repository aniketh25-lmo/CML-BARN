// ------------------ Farmer Schema Validation ------------------
// schema.js
const { body } = require('express-validator');

const { checkSchema } = require('express-validator');

const {check} = require('express-validator');

const farmerValidation = checkSchema({
  fullName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Full name is required',
    },
    trim: true,
    escape: true,
  },
  phoneNumber: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Phone number is required',
    },
    matches: {
      options: [/^[0-9]{10}$/],
      errorMessage: 'Phone number must be exactly 10 digits',
    },
    trim: true,
    escape: true,
  },
  aadharNumber: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Aadhaar number is required',
    },
    matches: {
      options: [/^\d{12}$/],
      errorMessage: 'Aadhaar number must be exactly 12 digits',
    },
    trim: true,
    escape: true,
  },
  cultivationPractices: {
    in: ['body'],
    optional: true,
    trim: true,
    escape: true,
  },
  landArea: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Land holdings are required',
    },
    isFloat: {
      options: { gt: 0 },
      errorMessage: 'Land holdings must be a positive number',
    },
  },
  landUnit: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['acre', 'hectare']],
      errorMessage: 'Land unit must be either "acre" or "hectare"',
    },
    trim: true,
    escape: true,
  },

  // Crops array
  'cropsSowing.*.name': {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Crop name is required',
    },
    isIn: {
      options: [['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses', 'Other']],
      errorMessage: 'Invalid crop name',
    },
    trim: true,
    escape: true,
  },
  'cropsSowing.*.quantity': {
    in: ['body'],
    optional: true,
    isFloat: {
      options: { gt: 0 },
      errorMessage: 'Quantity must be a positive number',
    },
  },
  'cropsSowing.*.unit': {
    in: ['body'],
    optional: true,
    trim: true,
    escape: true,
  },

  // Livestock array
  'livestock.*.type': {
    in: ['body'],
    optional: true,
    trim: true,
    escape: true,
  },
  'livestock.*.count': {
    in: ['body'],
    optional: true,
    isInt: {
      options: { gt: 0 },
      errorMessage: 'Livestock count must be a positive integer',
    },
  },
  'livestock.*.rearingPractices': {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Rearing practices must be a string',
    },
    trim: true,
    escape: true,
  },
});



const donationValidator = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      all_lowercase: true
    })
    .isEmail().withMessage('Valid email is required'),

  body('contact')
    .trim()
    .matches(/^\d{10}$/).withMessage('Valid 10-digit contact number is required'),

  body('amount')
    .isFloat({ min: 300 }).withMessage('Minimum donation amount is ₹300'),

  body('paymentId')
    .trim()
    .notEmpty().withMessage('Payment ID is required')
    .escape(),

  body('orderId')
    .trim()
    .notEmpty().withMessage('Order ID is required')
    .escape(),
];

const validateManager = [
  check('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required'),

  check('email')
    .trim()
    .escape()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      all_lowercase: true
    })
    .isEmail()
    .withMessage('Invalid email address'),

  check('phoneNumber')
    .optional({ checkFalsy: true }) // ✅ Allows undefined, null, or empty string
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/)
    .withMessage('Invalid Indian phone number'),

  check('password')
    .if((value, { req }) => !req.body.isGoogleAccount) // ✅ Skip if Google account
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];



const validateLogin = [
  check('email')
    .trim()
    .escape()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      all_lowercase: true
    })
    .isEmail().withMessage('Invalid email address'),


  check('password')
    .trim()
    .escape()
    .notEmpty().withMessage('Password is required'),
];

const validateGoogle = [
  check('code')
    .trim()
    .notEmpty()
    .withMessage('Google authorization code is required'),
];

const validateProduct = [
  // Product Name
  body('name')
    .notEmpty().withMessage('Product name is required')
    .bail()
    .trim()
    .escape(),

  // Category
  body('category')
    .notEmpty().withMessage('Category is required')
    .bail()
    .trim()
    .escape(),

  // Quantity
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .bail()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  // Price per Unit
  body('pricePerUnit')
    .notEmpty().withMessage('Price per unit is required')
    .bail()
    .isFloat({ min: 0.01 }).withMessage('Price per unit must be a positive number'),

  // Description (optional)
  body('description')
    .optional()
    .trim()
    .escape(),

  // Image URL (optional)
  body('image')
    .optional()
    .trim(),

  // Cloudinary Public ID (optional)
  body('cloudinaryId')
    .optional()
    .trim(),

  // Farmer Name
  body('farmerName')
    .notEmpty().withMessage('Farmer name is required')
    .bail()
    .trim()
    .escape(),

  // Aadhar Number
  body('aadharNumber')
    .notEmpty().withMessage('Aadhar number is required')
    .bail()
    .trim()
    .matches(/^\d{12}$/).withMessage('Aadhar number must be exactly 12 digits'),

  // Farmer ID (MongoDB ObjectId)
  body('farmerId')
    .notEmpty().withMessage('Farmer ID is required')
    .bail()
    .isMongoId().withMessage('Invalid Farmer ID'),
];

const orderValidator = [
  body('buyerName')
    .trim()
    .escape()
    .notEmpty().withMessage('Buyer name is required'),

  body('buyerEmail')
    .trim()
    .isEmail().withMessage('Invalid email')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      all_lowercase: true
    }),

  body('buyerAddress')
    .trim()
    .escape()
    .notEmpty().withMessage('Buyer address is required'),

  body('phoneNumber')
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit phone number'),

  body('sellerName')
    .trim()
    .escape()
    .notEmpty().withMessage('Seller name is required'),

  body('productName')
    .trim()
    .escape()
    .notEmpty().withMessage('Product name is required'),

  body('quantityBought')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  body('amountPaid')
    .isFloat({ min: 0.01 }).withMessage('Amount paid must be greater than 0'),

  body('orderId')
    .trim()
    .escape()
    .notEmpty().withMessage('Order ID is required'),

  body('paymentId')
    .trim()
    .escape()
    .notEmpty().withMessage('Payment ID is required')
];

const chatMessageValidator = [
  body('senderName')
    .trim()
    .notEmpty().withMessage('Sender name is required'),
  body('senderRole')
    .trim()
    .isIn(['manager', 'farmer']).withMessage('Sender role must be either manager or farmer'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
];

module.exports = {
  farmerValidation,
  donationValidator,
  validateManager,
  validateLogin,
  validateGoogle,
  validateProduct,
  orderValidator,
  chatMessageValidator
};