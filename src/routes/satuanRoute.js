const express = require('express');
const satuanController = require('../controllers/satuanController.js');
const satuanValidation = require('../validations/satuanValidation.js');
const validate = require('../middleware/validate.js');
const authenticate = require('../middleware/authMiddleware.js');
const isAdmin = require('../middleware/isAdmin.js');

const router = express.Router();

router.get('/', authenticate, isAdmin, satuanController.getAllSatuan);
router.post('/', authenticate, isAdmin, validate(satuanValidation), satuanController.createSatuan);
router.put('/:id', authenticate, isAdmin, validate(satuanValidation), satuanController.updateSatuan);
router.delete('/:id', authenticate, isAdmin, satuanController.deleteSatuan);

module.exports = router;