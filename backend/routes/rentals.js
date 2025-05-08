const express = require('express');
const router = express.Router();
const {
  createRental,
  getUserRentals,
  getRentalById,
  updateRentalStatus,
  getAllRentals,
  deleteRental
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createRental);
router.get('/myrentals', protect, getUserRentals);
router.get('/:id', protect, getRentalById);
router.put('/:id/status', protect, updateRentalStatus);

// Admin routes
router.get('/admin', protect, admin, getAllRentals);
router.delete('/:id', protect, admin, deleteRental);

module.exports = router;