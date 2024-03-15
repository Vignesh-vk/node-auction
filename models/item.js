const mongoose = require('mongoose');
const { auctionDB } = require('../db');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    highestBid: {
        type: Number,
        default: 0
    },
    winningBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = auctionDB.model('Item', itemSchema);
