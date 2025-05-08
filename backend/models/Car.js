const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
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
  features: {
    type: [String],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;