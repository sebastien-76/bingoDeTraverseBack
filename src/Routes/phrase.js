const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth/auth');

const phraseController = require('../controllers/phrase');

router.get('/', auth, phraseController.getPhrases);
router.get('/:id', auth, phraseController.getPhrase);
router.post('/', auth, phraseController.createPhrase);
router.put('/:id', auth, phraseController.updatePhrase);
router.delete('/:id', auth, phraseController.deletePhrase);

module.exports = router