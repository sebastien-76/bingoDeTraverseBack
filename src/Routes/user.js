const express = require('express');
const router = express.Router();

const multer = require('../Middleware/multer-config');

const userController = require('../controllers/user');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', multer, userController.signUp);
router.put('/:id', multer, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router