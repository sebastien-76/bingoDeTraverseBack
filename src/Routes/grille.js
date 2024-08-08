const express = require('express');
const router = express.Router();
const grilleController = require('../controllers/grille');

router.post('/user/:userId', grilleController.createGrille);
router.get('/user/:userId', grilleController.getGrilleByUser);
router.get('/:id', grilleController.getGrilleById);
router.put('/:id', grilleController.updateGrille);


module.exports = router;
