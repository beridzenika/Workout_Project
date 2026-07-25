const express = require('express');
const router = express.Router();
const PlanController = require('../../controllers/schedules/planController');
const authenticate = require('../../middleware/auth/authenticate');

//add authenticate
router.get('/', PlanController.getAll);
router.get('/:id', PlanController.getById);
router.post('/', PlanController.createPlan);
router.post('/:id/exercises', PlanController.addExercises);

module.exports = router;