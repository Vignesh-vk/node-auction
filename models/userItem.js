const mongoose = require('mongoose');
const { userDB } = require('../db');

const userItemSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bids: {
        type: [Object],
        default: []
    }
});

module.exports = userDB.model('UserItem', userItemSchema);
