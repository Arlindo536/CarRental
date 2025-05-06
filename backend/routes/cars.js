const express = require('express');
const router = express.Router();
const { 
  getCars, 
  getCarById,
  createCar 
} = require('../controllers/carController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getCars).post(protect, admin, createCar);
router.route('/:id').get(getCarById);

module.exports = router;