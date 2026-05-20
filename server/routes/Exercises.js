const express = require('express');
const router  = express.Router();

router.use(express.json());

const { Exercises } = require("../models");

// GET
router.get('/', async (req, res) => {
    const ListOfExercises = await Exercises.findAll();
    res.json(ListOfExercises);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const exercise = await Exercises.findByPk(id);

    if(!exercise) {
        return res.status(404).json({error: 'Exercise not found'});
    }
    res.json(exercise);
});

// POST
router.post('/', async (req, res) => {
    const newExercise = req.body;
    await Exercises.create(newExercise);
    res.status(201).json(newExercise);
});




module.exports = router;