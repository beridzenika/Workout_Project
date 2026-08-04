const express = require('express');
const router = express.Router();
const ExerciseController = require('../../controllers/exercises/exerciseController');
const authenticate = require('../../middleware/auth/authenticate');


router.get('/', ExerciseController.getAll);
router.get('/:id', ExerciseController.getById);

router.post('/', authenticate, ExerciseController.create);

module.exports = router;