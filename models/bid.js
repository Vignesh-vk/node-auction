const mongoose = require('mongoose');
const { auctionDB } = require('../db');

const bidSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  bidPlacedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = auctionDB.model('Bid', bidSchema);
