const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.get('/my-reviews',  reviewController.getMyShopReviews);
// Only institutes can create/manage reviews
router.use(authController.restrictTo('institute'));

router.post('/', reviewController.createReview);

router.get('/shop/:shopId', reviewController.getShopReviews);

router.route('/:reviewId')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router; 