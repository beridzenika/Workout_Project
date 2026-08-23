const express = require("express");
const router = express.Router();
const MuscleController = require("../../controllers/exercises/muscleController");
const authenticate = require('../../middleware/auth/authenticate');

router.get("/", MuscleController.getAll);
router.post("/", MuscleController.create);
router.delete("/:id", authenticate, MuscleController.delete);

module.exports = router;