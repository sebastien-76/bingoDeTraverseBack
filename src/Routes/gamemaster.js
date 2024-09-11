const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth/auth');

const gamemasterController = require('../controllers/gamemaster');

router.get('/', auth, gamemasterController.getGamemasters);
router.get('/:id', auth, gamemasterController.getGamemaster)
router.post('/', auth, gamemasterController.createGamemaster);
router.put('/:id', auth, gamemasterController.updateGamemaster);
router.delete('/:id',auth, gamemasterController.deleteGamemaster);

module.exports = router