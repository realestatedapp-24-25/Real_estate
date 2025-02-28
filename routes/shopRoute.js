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

// Inventory management routes - Place these BEFORE the :id routes
router
  .route('/inventory')
  .get(authController.restrictTo('shopkeeper'), shopController.getInventory)
  .post(authController.restrictTo('shopkeeper'), shopController.updateInventory);

router
  .route('/inventory/item')
  .post(authController.restrictTo('shopkeeper'), shopController.addInventoryItem);

router
  .route('/inventory/item/:itemId')
  .patch(authController.restrictTo('shopkeeper'), shopController.updateInventoryItem)
  .delete(authController.restrictTo('shopkeeper'), shopController.deleteInventoryItem);

// Nearby shops route
router.get('/nearby', authController.restrictTo('donor'), shopController.getNearbyShops);

// Place the :id routes LAST
router
  .route('/:id')
  .get(authController.restrictTo('admin', 'shopkeeper'), shopController.getShop)
  .patch(authController.restrictTo('admin', 'shopkeeper'), shopController.updateShop)
  .delete(authController.restrictTo('admin'), shopController.deleteShop);

module.exports = router;
