const express = require('express');
const { getMe, updateMe,getAllUsers,updateUser,deleteUser } = require('../controllers/userController');
const { protect} = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(protect); // All routes below need login
router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/all', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;