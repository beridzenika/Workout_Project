const express = require("express");
const router = express.Router();
const ExerciseTypeController = require("../../controllers/exercises/muscleController");
const authenticate = require('../../middleware/auth/authenticate');

router.get("/", ExerciseTypeController.getAll);
router.delete("/:id", authenticate, ExerciseTypeController.delete);

module.exports = router;