const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    shopName: { type: String, required: true },
    location: {
        type: { type: String, default: "Point", enum: ["Point"] },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, "Coordinates are required"],
        },
    },
    verificationStatus: { type: Boolean, default: false },
    inventory: [{
        itemName: { type: String, required: true },
        category: { type: String, required: true, enum: ['Grocery', 'Electronics', 'Clothing', 'Other'] },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true, enum: ['kg', 'liters', 'pieces', 'packs'] },
        pricePerUnit: { type: Number, required: true }
    }],
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    rating: { type: Number, min: 0, max: 5, default: 0 }
});

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);