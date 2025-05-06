const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Car'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per car
ReviewSchema.index({ user: 1, car: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);