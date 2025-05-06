const mongoose = require('mongoose');
const Car = require('../models/Car');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res) => {
  try {
    const type = req.query.type ? { type: req.query.type } : {};

    const cars = await Car.find({ ...type });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCarById = async (req, res) => {
    try {
      // Check if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid car ID format' });
      }
  
      const car = await Car.findById(req.params.id);
  
      if (car) {
        res.json(car);
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    } catch (error) {
      console.error('Error getting car by ID:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res) => {
  try {
    const car = new Car({
      name: req.body.name,
      type: req.body.type,
      year: req.body.year,
      passengers: req.body.passengers,
      transmission: req.body.transmission,
      luggage: req.body.luggage,
      price: req.body.price,
      image: req.body.image,
      features: req.body.features
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};