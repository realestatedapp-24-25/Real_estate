const geolib = require('geolib');
const Shipping = require('../models/shippingModel');
const Donation = require('../models/donationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Request = require('../models/requestModel');
const Email = require('../utils/email');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

exports.generateDeliveryQR = catchAsync(async (donationId) => {
    const qrCode = uuidv4();
    const qrImageData = await QRCode.toDataURL(qrCode);
    
    await Shipping.create({
        donation: donationId,
        qrCode,
        deliveryProof: {
            coordinates: {
                type: "Point",
                coordinates: [0, 0] // Default coordinates, will be updated during delivery
            }
        }
    });

    return qrImageData;
});

exports.verifyDelivery = catchAsync(async (req, res, next) => {
    const { qrCode } = req.params;
    const { photo, coordinates } = req.body;

    // Find shipping record
    const shipping = await Shipping.findOne({ qrCode })
        .populate({
            path: 'donation',
            populate: [
                { path: 'institute' },
                { path: 'shop' }
            ]
        });

    if (!shipping) {
        return next(new AppError('Invalid QR code', 400));
    }

    // Verify shopkeeper
    if (shipping.donation.shop.user.toString() !== req.user.id) {
        return next(new AppError('You are not authorized to deliver this donation', 403));
    }

    // Verify location
    const instituteCoords = shipping.donation.institute.geolocation.coordinates;
    const isValidLocation = shipping.verifyLocation(instituteCoords);

    if (!isValidLocation) {
        return next(new AppError('Delivery must be within 120 meters of institute', 400));
    }

    // Update shipping record
    shipping.status = 'delivered';
    shipping.deliveryProof = {
        photo,
        coordinates: {
            type: 'Point',
            coordinates: coordinates
        },
        timestamp: Date.now()
    };

    await shipping.save();

    // Update donation status
    await Donation.findByIdAndUpdate(shipping.donation._id, { status: 'completed' });

    // Send confirmation emails
    await new Email(shipping.donation.institute.user).sendDeliveryConfirmation(shipping);

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