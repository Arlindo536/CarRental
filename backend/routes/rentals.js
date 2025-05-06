const express = require('express');
const router = express.Router();
const { 
  createRental, 
  getUserRentals,
  updateRentalToPaid 
} = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createRental);
router.route('/myrentals').get(protect, getUserRentals);
router.route('/:id/pay').put(protect, updateRentalToPaid);

module.exports = router;