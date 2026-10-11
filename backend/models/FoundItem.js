const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    photoPath: { type: String, required: true },
    status: { type: String, enum: ['found', 'claimed', 'returned'], default: 'found' },
    foundBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoundItem', foundItemSchema);
