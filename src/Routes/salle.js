const express = require('express');
const router = express.Router();

const salleController = require('../controllers/salle');

router.get('/', salleController.getSalles);
router.get('/:id', salleController.getSalle);
router.post('/', salleController.createSalle);
router.put('/:id', salleController.updateSalle);
router.delete('/:id', salleController.deleteSalle);

module.exports = router