const geolib = require('geolib');
const Shipping = require('../models/shippingModel');
const Donation = require('../models/donationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Request = require('../models/requestModel');

exports.verifyDelivery = catchAsync(async (req, res, next) => {
    const { qrCode } = req.params;
    const { photo, coordinates } = req.body;

    // Find shipping record
    const shipping = await Shipping.findOne({ qrCode })
        .populate({
            path: 'donation',
            populate: { path: 'institute' }
        });

    if (!shipping) return next(new AppError('Invalid QR code', 400));

    // Verify location
    const instituteCoords = shipping.donation.institute.geolocation.coordinates;
    const isValidLocation = geolib.isPointWithinRadius(
        { latitude: coordinates[1], longitude: coordinates[0] },
        { latitude: instituteCoords[1], longitude: instituteCoords[0] },
        120
    );

    if (!isValidLocation) {
        return next(new AppError('Delivery must be within 120 meters of institute', 400));
    }

    // Update shipping record
    shipping.status = 'delivered';
    shipping.deliveryProof = {
        photo,
        coordinates: [coordinates[0], coordinates[1]],
        timestamp: Date.now()
    };

    // Update donation status
    await Donation.findByIdAndUpdate(shipping.donation._id, { status: 'completed' });

    // Update request status
    await Request.findOneAndUpdate(
        { institute: shipping.donation.institute._id },
        { status: 'fulfilled' }
    );

    await shipping.save();

    res.status(200).json({
        status: 'success',
        data: { shipping }
    });
});

exports.verifyQRCode = catchAsync(async (req, res, next) => {
    const { qrCode } = req.params;

    const shipping = await Shipping.findOne({ qrCode });
    if (!shipping) return next(new AppError('Invalid QR code', 400));

    shipping.status = 'delivered';
    await shipping.save();

    res.status(200).json({
        status: 'success',
        message: 'QR code verified and delivery confirmed',
        data: { shipping }
    });
}); 