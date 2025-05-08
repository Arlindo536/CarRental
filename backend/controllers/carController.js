const Car = require('../models/Car');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Makina nuk u gjet' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Makina nuk u gjet' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const {
      name,
      type,
      year,
      passengers,
      transmission,
      luggage,
      price,
      image,
      features
    } = req.body;

    const car = new Car({
      name,
      type,
      year,
      passengers,
      transmission,
      luggage,
      price,
      image,
      features
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const {
      name,
      type,
      year,
      passengers,
      transmission,
      luggage,
      price,
      image,
      features,
      isAvailable
    } = req.body;

    const car = await Car.findById(req.params.id);

    if (car) {
      car.name = name || car.name;
      car.type = type || car.type;
      car.year = year || car.year;
      car.passengers = passengers || car.passengers;
      car.transmission = transmission || car.transmission;
      car.luggage = luggage || car.luggage;
      car.price = price || car.price;
      car.image = image || car.image;
      car.features = features || car.features;
      car.isAvailable = isAvailable !== undefined ? isAvailable : car.isAvailable;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Makina nuk u gjet' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.remove();
      res.json({ message: 'Makina u fshi' });
    } else {
      res.status(404).json({ message: 'Makina nuk u gjet' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};