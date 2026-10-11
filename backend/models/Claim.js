const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verificationDetails: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Claim', claimSchema);
