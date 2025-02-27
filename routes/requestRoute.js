const express = require('express');
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for requests
router
  .route('/')
  .get(authController.restrictTo('admin', 'institute', 'shopkeeper', 'donor'), requestController.getAllRequests)
  .post(authController.restrictTo('institute'), requestController.createRequest);

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'institute', 'shopkeeper', 'donor'), requestController.getRequest);

module.exports = router; 