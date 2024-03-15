const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;
    if (!email && !mobileNumber) {
      return res.json({
        status: 400,
        msg: "Registration failed",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, mobileNumber, password: hashedPassword });
      return res.json({
        status: 201,
        msg: "Registered successfully",
        data: user
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      msg: "Registration failed",
    });
  }
});

router.post('/login', async (req, res) => {
  try {


    const { email, mobileNumber, password } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email: email });
    } else if (mobileNumber) {
      user = await User.findOne({ mobileNumber: mobileNumber });
    } else {
      return res.status(400).json({ status: 400, msg: 'Invalid credential format' });
    }
    if (!user) {
      return res.json({
        status: 401,
        msg: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        status: 400,
        msg: "Invalid email or password",
      });
    }
    const token = jwt.sign({ email: user.email, mobileNumber: user.mobileNumber, _id: user._id }, 'secret', { expiresIn: '1h' });
    return res.json({
      status: 200,
      msg: "Logged in successfully",
      data: token
    });
  } catch (error) {
    return res.json({
      status: 500,
      msg: "Login failed",
    });
  }
});

module.exports = router;

