const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth/auth');

const multer = require('../Middleware/multer-config');

const userController = require('../controllers/user');

router.get('/', auth, userController.getUsers);
router.get('/:id', auth,  userController.getUser);
router.post('/', multer, userController.signUp);
router.put('/:id', auth, multer, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router