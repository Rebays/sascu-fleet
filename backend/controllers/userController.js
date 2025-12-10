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
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find()
    .select('-password') // never send password
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  // Prevent changing role via this route (use separate endpoint if needed)
  if (req.body.role) {
    return res.status(400).json({
      message: 'Use dedicated endpoint to change user role',
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, phone },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    success: true,
    data: user,
  });
});

//Admin only
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Optional: Prevent deleting yourself
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete yourself' });
  }

  // Optional: Prevent deleting other admins
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Cannot delete admin accounts' });
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = { getMe, updateMe, getAllUsers, updateUser, deleteUser };