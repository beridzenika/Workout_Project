const express = require('express');
const router = express.Router();
const PlanController = require('../../controllers/schedules/planController');
const authenticate = require('../../middleware/auth/authenticate');

router.get('/', PlanController.getAll);
router.get('/:id', PlanController.getById);
router.post('/', authenticate, PlanController.createPlan);
router.post('/:id/exercises', authenticate, PlanController.addExercises);

module.exports = router;