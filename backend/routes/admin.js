const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getUsers, updateUserRole } = require('../controllers/adminController');

router.use(protect, admin);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;



