const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth/auth');
const grilleController = require('../controllers/grille');

router.post('/user/:userId', grilleController.createGrille);
router.get('/user/:userId',auth,  grilleController.getGrilleByUser);
router.get('/:id',auth,  grilleController.getGrilleById);
router.put('/:id',auth,  grilleController.updateGrille);


module.exports = router;
