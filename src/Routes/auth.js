// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Route pour la demande de réinitialisation de mot de passe
router.post('/forgot-password', userController.forgotPassword);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', userController.resetPassword);

module.exports = router;
