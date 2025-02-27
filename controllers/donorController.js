const Donor = require('../models/donorModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Shop = require('../models/shopModel');
const Institute = require('../models/InstituteModel');
const Request = require('../models/requestModel');
const Donation = require('../models/donationModel');
const Email = require('../utils/email');
const QRCode = require('qrcode');

// Create a new donor
exports.createDonor = catchAsync(async (req, res, next) => {
    const donor = await Donor.create({
        user: req.user.id,
        total_donations: req.body.total_donations,
        last_donation_date: req.body.last_donation_date
    });

    res.status(201).json({
        status: 'success',
        data: { donor }
    });
});

// Get all donors
exports.getAllDonors = catchAsync(async (req, res, next) => {
    const donors = await Donor.find();
    res.status(200).json({
        status: 'success',
        results: donors.length,
        data: { donors }
    });
});

// Get a single donor
exports.getDonor = catchAsync(async (req, res, next) => {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
        return next(new AppError('No donor found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { donor }
    });
});

// Update a donor
exports.updateDonor = catchAsync(async (req, res, next) => {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!donor) {
        return next(new AppError('No donor found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { donor }
    });
});

// Delete a donor
exports.deleteDonor = catchAsync(async (req, res, next) => {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
        return next(new AppError('No donor found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getShopsNearInstitute = catchAsync(async (req, res, next) => {
    // 1) Get institute
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
        return next(new AppError('No institute found with that ID', 404));
    }

    // 2) Convert radius to number (default 500 meters)
    const radius = req.query.radius ? Number(req.query.radius) : 500;

    // Validate radius input
    if (isNaN(radius) || radius < 0) {
        return next(new AppError('Invalid radius value', 400));
    }

    // 3) Find shops using geospatial query
    const shops = await Shop.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: institute.geolocation.coordinates
                },
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        },
        {
            $match: {
                verificationStatus: true
            }
        },
        {
            $project: {
                _id: 1,
                shopName: 1,
                distance: 1,
                inventory: 1,
                contactInfo: 1,
                rating: 1
            }
        }
    ]);

    // 4) Handle no shops found
    if (shops.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: `No verified shops found within ${radius}m radius`
        });
    }

    // 5) Format response with exact meter distances
    const response = shops.map(shop => ({
        ...shop,
        distance: Math.round(shop.distance) // Round to nearest meter
    }));

    res.status(200).json({
        status: 'success',
        results: response.length,
        data: {
            radius: radius,
            institute: institute._id,
            shops: response
        }
    });
});

exports.getShopsWithRequestedItems = catchAsync(async (req, res, next) => {
    // 1) Get institute and its request
    const institute = await Institute.findById(req.params.instituteId);
    if (!institute) {
        return next(new AppError('No institute found with that ID', 404));
    }

    const request = await Request.findOne({ institute: institute._id, status: 'pending' });
    if (!request) {
        return next(new AppError('No pending request found for this institute', 404));
    }

    // 2) Convert radius to number (default 500 meters)
    const radius = req.query.radius ? Number(req.query.radius) : 500;

    // Validate radius input
    if (isNaN(radius) || radius < 0) {
        return next(new AppError('Invalid radius value', 400));
    }

    // 3) Find shops using geospatial query
    const shops = await Shop.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: institute.geolocation.coordinates
                },
                distanceField: "distance",
                maxDistance: radius,
                spherical: true
            }
        },
        {
            $match: {
                verificationStatus: true
            }
        }
    ]);

    // 4) Check which shops have the requested items
    const matchingShops = shops.filter(shop => {
        return request.items.some(requestedItem => {
            return shop.inventory.some(inventoryItem => {
                return inventoryItem.itemName === requestedItem.name && inventoryItem.quantity >= requestedItem.quantity;
            });
        });
    });

    // 5) Handle no matching shops found
    if (matchingShops.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No shops found with the requested items within the specified radius'
        });
    }

    // 6) Format response
    const response = matchingShops.map(shop => ({
        shopName: shop.shopName,
        distance: Math.round(shop.distance), // Round to nearest meter
        inventory: shop.inventory,
        contactInfo: shop.contactInfo,
        rating: shop.rating
    }));

    res.status(200).json({
        status: 'success',
        results: response.length,
        data: {
            radius: radius,
            institute: institute._id,
            shops: response
        }
    });
});

exports.createDonation = catchAsync(async (req, res, next) => {
    const { shopId, items } = req.body;
    const instituteId = req.params.instituteId;

    const shop = await Shop.findById(shopId);
    if (!shop) return next(new AppError('Shop not found', 404));

    const institute = await Institute.findById(instituteId).populate('user');
    if (!institute) return next(new AppError('Institute not found', 404));

    const request = await Request.findOne({ institute: instituteId, status: { $in: ['pending', 'partially fulfilled'] } });
    if (!request) return next(new AppError('No pending or partially fulfilled request found for this institute', 404));

    let totalAmount = 0;
    const fulfilledItems = [];

    items.forEach(item => {
        const shopItem = shop.inventory.find(i => i.itemName === item.name);
        if (!shopItem || shopItem.quantity < item.quantity) {
            return next(new AppError(`Insufficient stock for ${item.name}`, 400));
        }
        totalAmount += shopItem.pricePerUnit * item.quantity;
        fulfilledItems.push({ name: item.name, quantity: item.quantity, unit: item.unit });
    });

    const donation = await Donation.create({
        donor: req.user.id,
        institute: instituteId,
        shop: shopId,
        items: fulfilledItems,
        totalAmount
    });

    items.forEach(item => {
        const shopItem = shop.inventory.find(i => i.itemName === item.name);
        shopItem.quantity -= item.quantity;
    });
    await shop.save();

    // Update request fulfillment details
    const remainingItems = request.items.map(reqItem => {
        const fulfilledItem = fulfilledItems.find(item => item.name === reqItem.name);
        if (fulfilledItem) {
            reqItem.quantity -= fulfilledItem.quantity;
            if (reqItem.quantity < 0) reqItem.quantity = 0; // Ensure quantity does not go negative
        }
        return reqItem;
    });

    let requestStatus = 'fulfilled';
    if (remainingItems.some(item => item.quantity > 0)) {
        requestStatus = 'partially fulfilled';
    }

    await Request.findByIdAndUpdate(request._id, {
        status: requestStatus,
        items: remainingItems,
        $addToSet: {
            'fulfillmentDetails.shops': shopId,
            'fulfillmentDetails.donors': req.user.id
        }
    });

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(donation._id.toString());

    // Send email to the user associated with the institute
    const instituteEmail = new Email({ email: institute.user.email, name: institute.user.name }, '');
    await instituteEmail.sendDonationNotificationWithQR(institute.name, items, totalAmount, qrCodeData);

    // Send email to the shopkeeper
    const shopkeeperEmail = new Email({ email: shop.contactInfo.email, name: shop.shopName }, '');
    await shopkeeperEmail.sendDonationNotification(shop.shopName, items, totalAmount);

    res.status(201).json({
        status: 'success',
        data: { donation }
    });
}); 