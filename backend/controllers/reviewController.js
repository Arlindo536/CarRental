const Review = require('../models/Review');
const Car = require('../models/Car');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check if user already reviewed this car
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      car: carId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Car already reviewed' });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      car: carId,
      rating: Number(rating),
      comment
    });

    await review.save();

    // Update car ratings
    const reviews = await Review.find({ car: carId });
    car.numReviews = reviews.length;
    car.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await car.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reviews for a car
// @route   GET /api/reviews/:carId
// @access  Public
exports.getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};