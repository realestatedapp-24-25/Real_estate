const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Request = require('../models/requestModel');
const Institute = require('../models/instituteModel');
const Shop = require('../models/shopModel');
const User = require('../models/userModel');

// Create a new request
// Create a new request (for institutes)
exports.createRequest = catchAsync(async (req, res, next) => {
    // 1) Check if user is an institute
    if (req.user.role !== 'institute') {
        return next(new AppError('Only institutes can create requests', 403));
    }

    // 2) Find institute associated with the user
    const institute = await Institute.findOne({ user: req.user.id });
    if (!institute) {
        return next(new AppError('No institute found for this user', 404));
    }

    // 3) Create request with institute reference
    const { items, category, priority, comments } = req.body;
    
    const newRequest = await Request.create({
        institute: institute._id,
        items,
        category,
        priority,
        comments
    });

    // 4) Populate institute details in response
    await newRequest.populate({
        path: 'institute',
        select: 'name description institute_type geolocation contactInfo'
    });

    res.status(201).json({
        status: 'success',
        data: {
            request: newRequest
        }
    });
});

// Get all requests
exports.getAllRequests = catchAsync(async (req, res, next) => {
    const requests = await Request.find()
        .populate({
            path: 'institute',
            select: 'name description institute_type geolocation contactInfo',
            populate: {
                path: 'user',
                select: 'name email'
            }
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: requests.length,
        data: {
            requests
        }
    });
});

// Get a single request
exports.getRequest = catchAsync(async (req, res, next) => {
    const request = await Request.findById(req.params.id)
        .populate({
            path: 'institute',
            select: 'name contactInfo geolocation',
            populate: {
                path: 'user',
                select: 'name email'
            }
        });

    if (!request) {
        return next(new AppError('No request found with that ID', 404));
    }

    // Check if user has permission to view this request
    if (req.user.role === 'institute' && request.institute.user._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to view this request', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            request
        }
    });
});