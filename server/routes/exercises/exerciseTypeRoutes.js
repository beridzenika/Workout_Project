const express = require("express");
const router = express.Router();
const ExerciseTypeController = require("../../controllers/exercises/exerciseTypeController");
const authenticate = require('../../middleware/auth/authenticate');

router.get("/", ExerciseTypeController.getAll);
router.post("/", ExerciseTypeController.create);
// router.post("/", authenticate, ExerciseTypeController.create);
router.delete("/:id", authenticate, ExerciseTypeController.delete);

module.exports = router;