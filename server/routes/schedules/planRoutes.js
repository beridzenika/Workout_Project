const express = require('express');
const router = express.Router();
const PlanController = require('../../controllers/schedules/planController');

router.get('/', PlanController.getAll);
router.get('/:id', PlanController.getById);
router.post('/', PlanController.create);

module.exports = router;