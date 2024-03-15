const mongoose = require('mongoose');

const userDBUrl = 'mongodb://127.0.0.1:27017/userDB';
const auctionDBUrl = 'mongodb://127.0.0.1:27017/auctionDB';

const userDB = mongoose.createConnection(userDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const auctionDB = mongoose.createConnection(auctionDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

userDB.on('error', console.error.bind(console, 'User DB connection error:'));
auctionDB.on('error', console.error.bind(console, 'Auction DB connection error:'));

module.exports = { userDB, auctionDB };
