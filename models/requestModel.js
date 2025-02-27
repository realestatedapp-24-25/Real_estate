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
    category: {
        type: String,
        enum: ['FOOD', 'CLOTHING', 'EDUCATION', 'MEDICAL', 'OTHER'],
        required: true
    },
    priority: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'MEDIUM'
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled'],
        default: 'pending'
    },
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent automatic _id generation for items
requestSchema.path('items').schema.set('_id', false);

module.exports = mongoose.model('Request', requestSchema);
module.exports = mongoose.model('Request', requestSchema);