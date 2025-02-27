const express = require('express');
const shippingController = require('../controllers/shippingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/verify-delivery/:qrCode', authController.restrictTo('shopkeeper'), shippingController.verifyDelivery);
router.post('/verify-qr/:qrCode', authController.restrictTo('shopkeeper'), shippingController.verifyQRCode);

module.exports = router; 