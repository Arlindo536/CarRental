const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Upload image
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  try {
    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;