const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth/auth');

const salleController = require('../controllers/salle');

router.get('/', auth, salleController.getSalles);
router.get('/:id', auth, salleController.getSalle);
router.post('/', auth, salleController.createSalle);
router.put('/:id', auth, salleController.updateSalle);
router.delete('/:id', auth, salleController.deleteSalle);

module.exports = router