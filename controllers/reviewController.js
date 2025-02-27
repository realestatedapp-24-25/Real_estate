const Review = require('../models/reviewModel');
const Donation = require('../models/donationModel');
const Institute = require('../models/instituteModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
    const { rating, comment, shopId, donationId } = req.body;

    // Find the institute associated with the logged-in user
    const institute = await Institute.findOne({ user: req.user.id });

    if (!institute) {
        return next(new AppError('No institute found for this user', 404));
    }

    // Check if donation exists and belongs to the institute
    const donation = await Donation.findOne({
        _id: donationId,
        institute: institute._id,
        shop: shopId,
    });

    if (!donation) {
        return next(new AppError('No completed donation found with this ID for your institute', 404));
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
        institute: institute._id,
        donation: donationId
    });

    if (existingReview) {
        return next(new AppError('You have already reviewed this donation', 400));
    }

    // Create review
    const review = await Review.create({
        institute: institute._id,
        shop: shopId,
        rating,
        comment,
        donation: donationId
    });

    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.getShopReviews = catchAsync(async (req, res, next) => {
    const { shopId } = req.params;

    const reviews = await Review.find({ shop: shopId })
        .populate({
            path: 'institute',
            select: 'institute_name'
        })
        .populate({
            path: 'donation',
            select: 'items totalAmount createdAt'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.updateReview = catchAsync(async (req, res, next) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;

    // Find the institute associated with the logged-in user
    const institute = await Institute.findOne({ user: req.user.id });

    if (!institute) {
        return next(new AppError('No institute found for this user', 404));
    }

    const review = await Review.findOne({
        _id: reviewId,
        institute: institute._id
    });

    if (!review) {
        return next(new AppError('Review not found or not authorized', 404));
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;

    // Find the institute associated with the logged-in user
    const institute = await Institute.findOne({ user: req.user.id });

    if (!institute) {
        return next(new AppError('No institute found for this user', 404));
    }

    const review = await Review.findOne({
        _id: reviewId,
        institute: institute._id
    });

    if (!review) {
        return next(new AppError('Review not found or not authorized', 404));
    }

    await review.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
}); 