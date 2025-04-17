const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword
} = require('../controllers/user.controller');

// All routes are protected
router.use(auth);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/change-password', changePassword);

module.exports = router; 