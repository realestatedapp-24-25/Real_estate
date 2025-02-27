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

// Protect all inventory routes
router.use(authController.protect);
router.use(authController.restrictTo('shopkeeper'));

// Inventory management routes
router
    .route('/inventory')
    .get(shopController.getInventory)
    .post(shopController.updateInventory);

router.post('/inventory/item', shopController.addInventoryItem);

router
    .route('/inventory/item/:itemId')
    .patch(shopController.updateInventoryItem)
    .delete(shopController.deleteInventoryItem);

module.exports = router;
