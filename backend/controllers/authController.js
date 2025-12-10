const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;

  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email and password are required',
    });
  }

  // Optional: extra password length check
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters',
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, phone });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, email:user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

module.exports = { register, login };