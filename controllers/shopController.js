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

exports.getInventory = catchAsync(async (req, res, next) => {
    const shop = await Shop.findOne({ user: req.user.id });
    
    if (!shop) {
        return next(new AppError('Shop not found', 404));
    }

    res.status(200).json({
        status: 'success',
        results: shop.inventory.length,
        data: {
            inventory: shop.inventory
        }
    });
});

exports.updateInventory = catchAsync(async (req, res, next) => {
    const { items } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items)) {
        return next(new AppError('Please provide valid inventory items array', 400));
    }

    // Validate each item
    for (const item of items) {
        if (!item.itemName || !item.quantity || !item.unit || !item.pricePerUnit) {
            return next(new AppError('Each item must have itemName, quantity, unit, and pricePerUnit', 400));
        }
    }

    // Find shop and update inventory
    const shop = await Shop.findOne({ user: req.user.id });
    
    if (!shop) {
        return next(new AppError('Shop not found', 404));
    }

    // Merge new items with existing inventory
    const updatedInventory = [...shop.inventory];
    
    items.forEach(newItem => {
        const existingItemIndex = updatedInventory.findIndex(item => 
            item.itemName.toLowerCase() === newItem.itemName.toLowerCase() && 
            item.unit.toLowerCase() === newItem.unit.toLowerCase()
        );

        if (existingItemIndex !== -1) {
            // Update existing item
            updatedInventory[existingItemIndex] = {
                ...updatedInventory[existingItemIndex],
                ...newItem
            };
        } else {
            // Add new item
            updatedInventory.push(newItem);
        }
    });

    shop.inventory = updatedInventory;
    await shop.save();

    res.status(200).json({
        status: 'success',
        data: {
            inventory: shop.inventory
        }
    });
});

exports.addInventoryItem = catchAsync(async (req, res, next) => {
    const { itemName, quantity, unit, pricePerUnit } = req.body;

    // Validate input
    if (!itemName || !quantity || !unit || !pricePerUnit) {
        return next(new AppError('Please provide itemName, quantity, unit, and pricePerUnit', 400));
    }

    const shop = await Shop.findOne({ user: req.user.id });
    
    if (!shop) {
        return next(new AppError('Shop not found', 404));
    }

    // Check if item already exists
    const existingItemIndex = shop.inventory.findIndex(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase() && 
        item.unit.toLowerCase() === unit.toLowerCase()
    );

    if (existingItemIndex !== -1) {
        // Update existing item
        shop.inventory[existingItemIndex].quantity += quantity;
        shop.inventory[existingItemIndex].pricePerUnit = pricePerUnit;
    } else {
        // Add new item
        shop.inventory.push({
            itemName,
            quantity,
            unit,
            pricePerUnit
        });
    }

    await shop.save();

    res.status(200).json({
        status: 'success',
        data: {
            inventory: shop.inventory
        }
    });
});

exports.updateInventoryItem = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const { quantity, pricePerUnit } = req.body;

    const shop = await Shop.findOne({ user: req.user.id });
    
    if (!shop) {
        return next(new AppError('Shop not found', 404));
    }

    const item = shop.inventory.id(itemId);
    if (!item) {
        return next(new AppError('Item not found in inventory', 404));
    }

    // Update item
    if (quantity !== undefined) item.quantity = quantity;
    if (pricePerUnit !== undefined) item.pricePerUnit = pricePerUnit;

    await shop.save();

    res.status(200).json({
        status: 'success',
        data: {
            item
        }
    });
});

exports.deleteInventoryItem = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;

    const shop = await Shop.findOne({ user: req.user.id });
    
    if (!shop) {
        return next(new AppError('Shop not found', 404));
    }

    const item = shop.inventory.id(itemId);
    if (!item) {
        return next(new AppError('Item not found in inventory', 404));
    }

    item.remove();
    await shop.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
}); 