const express = require('express');
const router = express.Router();

const phraseController = require('../controllers/phrase');

router.get('/', phraseController.getPhrases);
router.get('/:id', phraseController.getPhrase);
router.post('/', phraseController.createPhrase);
router.put('/:id', phraseController.updatePhrase);
router.delete('/:id', phraseController.deletePhrase);

module.exports = router