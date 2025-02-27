const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true }
    }],
    urgency: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    status: {
        type: String,
        enum: ['pending', 'partially_fulfilled', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    description: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent automatic _id generation for items
requestSchema.path('items').schema.set('_id', false);

module.exports = mongoose.model('Request', requestSchema);