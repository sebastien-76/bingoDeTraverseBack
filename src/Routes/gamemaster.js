const express = require('express');
const router = express.Router();

const gamemasterController = require('../controllers/gamemaster');

router.get('/', gamemasterController.getGamemasters);
router.get('/:id', gamemasterController.getGamemaster)
router.post('/', gamemasterController.createGamemaster);
router.put('/:id', gamemasterController.updateGamemaster);
router.delete('/:id', gamemasterController.deleteGamemaster);

module.exports = router