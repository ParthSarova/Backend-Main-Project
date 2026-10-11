const express = require('express');
const router = express.Router();
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const { protect, staffOnly } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const items = await FoundItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, staffOnly, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Photo is required' });

        const item = new FoundItem({
            description: req.body.description,
            photoPath: `/uploads/${req.file.filename}`,
            foundBy: req.user.id
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:id/claim', protect, async (req, res) => {
    const { verificationDetails } = req.body;
    try {
        if (!verificationDetails) return res.status(400).json({ message: 'Verification details are required' });

        const item = await FoundItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.status !== 'found') return res.status(400).json({ message: 'Item already claimed or returned' });

        const claim = new Claim({
            item: req.params.id,
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

module.exports = router;
