const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getCarReviews 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createReview);
router.route('/:carId').get(getCarReviews);

module.exports = router;