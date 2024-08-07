const express = require('express');
const router = express.Router();

const connexionController = require('../controllers/connexion');

router.post('/', connexionController.signin);


module.exports = router

