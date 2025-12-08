const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

const updateMe = catchAsync(async (req, res) => {
  const updates = (({ name, phone }) => ({ name, phone }))(req.body);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.json(user);
});

module.exports = { getMe, updateMe };