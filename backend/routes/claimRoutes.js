const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');
const { protect, staffOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, async (req, res) => {
    const { itemId, verificationDetails } = req.body;
    try {
        if (!verificationDetails) return res.status(400).json({ message: 'Verification details are required' });

        const item = await FoundItem.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.status !== 'found') return res.status(400).json({ message: 'Item already claimed or returned' });

        const claim = new Claim({
            item: itemId,
            student: req.user.id,
            verificationDetails
        });

        await claim.save();
        item.status = 'claimed';
        await item.save();

        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, staffOnly, async (req, res) => {
    try {
        const claims = await Claim.find({}).populate('item').populate('student', 'name email');
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/approve', protect, staffOnly, async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });

        claim.status = 'approved';
        await claim.save();

        const item = await FoundItem.findById(claim.item);
        if (item) {
            item.status = 'returned';
            await item.save();
        }

        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
