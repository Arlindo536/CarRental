const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ekonomik', 'familjar', 'luksoz', 'suv']
  },
  year: {
    type: Number,
    required: true
  },
  passengers: {
    type: Number,
    required: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Automatike', 'Manuale']
  },
  luggage: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', CarSchema);