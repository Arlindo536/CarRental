const Rental = require('../models/Rental');
const Car = require('../models/Car');

// @desc    Create new rental
// @route   POST /api/rentals
// @access  Private
exports.createRental = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      paymentMethod
    } = req.body;

    // Calculate days difference
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Get car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Calculate total price
    const totalPrice = car.price * diffDays;

    const rental = new Rental({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
      paymentMethod
    });

    const createdRental = await rental.save();
    res.status(201).json(createdRental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user rentals
// @route   GET /api/rentals/myrentals
// @access  Private
exports.getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('car', 'name image price')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update rental to paid
// @route   PUT /api/rentals/:id/pay
// @access  Private
exports.updateRentalToPaid = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (rental) {
      rental.isPaid = true;
      rental.paidAt = Date.now();
      rental.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
      };

      const updatedRental = await rental.save();
      res.json(updatedRental);
    } else {
      res.status(404).json({ message: 'Rental not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};