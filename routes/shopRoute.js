const express = require('express');
const shopController = require('../controllers/shopController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Restrict routes to specific roles
router
  .route('/')
  .get(authController.restrictTo('admin', 'shopkeeper'), shopController.getAllShops)
  .post(authController.restrictTo('admin', 'shopkeeper'), shopController.createShop);

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'shopkeeper'), shopController.getShop)
  .patch(authController.restrictTo('admin', 'shopkeeper'), shopController.updateShop)
  .delete(authController.restrictTo('admin'), shopController.deleteShop);

router.get('/nearby', authController.restrictTo('donor'), shopController.getNearbyShops);

module.exports = router;
