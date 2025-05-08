const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;