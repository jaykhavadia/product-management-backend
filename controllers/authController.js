const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, error: 'Email already exists' });

    user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ success: true, data: { token }, message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ success: true, data: { token }, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
