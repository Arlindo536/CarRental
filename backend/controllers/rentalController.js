const Rental = require('../models/Rental');
const Car = require('../models/Car');

// @desc    Create new rental
// @route   POST /api/rentals
// @access  Private
const createRental = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      paymentMethod,
      totalPrice
    } = req.body;

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Makina nuk u gjet' });
    }

    // Check if car is available
    if (!car.isAvailable) {
      return res.status(400).json({ message: 'Makina nuk është e disponueshme' });
    }

    // Create new rental
    const rental = new Rental({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod === 'credit_card' // Mark as paid if using credit card
    });

    if (paymentMethod === 'credit_card') {
      rental.paidAt = Date.now();
    }

    const createdRental = await rental.save();

    res.status(201).json(createdRental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user rentals
// @route   GET /api/rentals/myrentals
// @access  Private
const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'name email')
      .populate('car');

    // Check if rental exists and belongs to user or user is admin
    if (rental && (rental.user._id.toString() === req.user._id.toString() || req.user.isAdmin)) {
      res.json(rental);
    } else {
      res.status(404).json({ message: 'Rezervimi nuk u gjet' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update rental status
// @route   PUT /api/rentals/:id/status
// @access  Private
const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: 'Rezervimi nuk u gjet' });
    }

    // Check if user is authorized (owner or admin)
    if (rental.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Nuk jeni i autorizuar' });
    }

    // If user is not admin, can only cancel
    if (!req.user.isAdmin && status !== 'cancelled') {
      return res.status(401).json({ message: 'Nuk jeni i autorizuar për këtë veprim' });
    }

    // Update rental status
    rental.status = status;
    
    // If marked as paid, update paidAt
    if (req.body.isPaid) {
      rental.isPaid = true;
      rental.paidAt = Date.now();
    }

    const updatedRental = await rental.save();
    res.json(updatedRental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all rentals (admin)
// @route   GET /api/rentals/admin
// @access  Private/Admin
const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({})
      .populate('user', 'name email')
      .populate('car')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a rental
// @route   DELETE /api/rentals/:id
// @access  Private/Admin
const deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (rental) {
      await rental.remove();
      res.json({ message: 'Rezervimi u fshi' });
    } else {
      res.status(404).json({ message: 'Rezervimi nuk u gjet' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
  updateRentalStatus,
  getAllRentals,
  deleteRental
};