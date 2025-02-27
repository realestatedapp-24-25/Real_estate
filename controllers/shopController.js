const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create a new shop
exports.createShop = catchAsync(async (req, res, next) => {
    const shop = await Shop.create({
        user: req.user.id,
        shopName: req.body.shopName,
        location: req.body.location,
        verificationStatus: req.body.verificationStatus,
        inventory: req.body.inventory,
        contactInfo: req.body.contactInfo
    });

    res.status(201).json({
        status: 'success',
        data: { shop }
    });
});

// Get all shops
exports.getAllShops = catchAsync(async (req, res, next) => {
    const shops = await Shop.find();
    res.status(200).json({
        status: 'success',
        results: shops.length,
        data: { shops }
    });
});

// Get a single shop
exports.getShop = catchAsync(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
        return next(new AppError('No shop found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { shop }
    });
});

// Update a shop
exports.updateShop = catchAsync(async (req, res, next) => {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!shop) {
        return next(new AppError('No shop found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { shop }
    });
});

// Delete a shop
exports.deleteShop = catchAsync(async (req, res, next) => {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
        return next(new AppError('No shop found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getNearbyShops = catchAsync(async (req, res, next) => {
    const { latitude, longitude, distance } = req.query;

    if (!latitude || !longitude || !distance) {
        return next(new AppError('Please provide latitude, longitude, and distance', 400));
    }

    const radius = distance / 6378.1; // Convert distance to radians (Earth's radius in km)

    const shops = await Shop.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius]
            }
        }
    });

    if (!shops.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'No stores found within the specified radius'
        });
    }

    res.status(200).json({
        status: 'success',
        results: shops.length,
        data: { shops }
    });
}); 