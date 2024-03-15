// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./router/user');
const itemRoutes = require('./router/item');
const { userDB, auctionDB } = require('./db');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

userDB.once('open', () => console.log('User DB connected'));
userDB.on('error', console.error.bind(console, 'User DB connection error:'));

auctionDB.once('open', () => console.log('Auction DB connected'));
auctionDB.on('error', console.error.bind(console, 'Auction DB connection error:'));

mongoose.connect('mongodb://127.0.0.1:27017/mainDB', { useNewUrlParser: true, useUnifiedTopology: true });
const mainDB = mongoose.connection;

mainDB.once('open', () => console.log('Main DB connected'));
mainDB.on('error', console.error.bind(console, 'Main DB connection error:'));
