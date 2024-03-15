const mongoose = require('mongoose');

const userDBUrl = 'mongodb+srv://vigneshpanneer7:Vignesh2000@cluster0.vd0vkzi.mongodb.net/userDB';
const auctionDBUrl = 'mongodb+srv://vigneshpanneer7:Vignesh2000@cluster0.vd0vkzi.mongodb.net/auctionDB';

const userDB = mongoose.createConnection(userDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const auctionDB = mongoose.createConnection(auctionDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

userDB.on('error', console.error.bind(console, 'User DB connection error:'));
auctionDB.on('error', console.error.bind(console, 'Auction DB connection error:'));

module.exports = { userDB, auctionDB };
