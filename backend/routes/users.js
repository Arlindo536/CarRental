const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin access
router.use(protect, admin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;