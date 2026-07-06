const express = require('express');
const router  = express.Router();


const { Exercises, Muscles, ExerciseTypes } = require("../models");

// GET
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercises.findAll({
            include: [
                {
                    model: ExerciseTypes,
                },
                {
                    model: Muscles,
                    through: { attributes: [] },
                },
            ],
        });
        res.status(200).json(exercises);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid exercise ID"
            });
        }
        
        const exercise = await Exercises.findByPk(id, {
            include: [
                {
                    model: ExerciseTypes,
                },
                {
                    model: Muscles,
                    through: { attributes: [] }
                },
            ]
        });

        if(!exercise) {
            return res.status(404).json({error: 'Exercise not found'});
        }
        res.status(200).json(exercise);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const {
            name,
            type_id,
            default_sets,
            default_reps,
            default_weight,
            description,
            progression_from,
            muscles,
        } = req.body;
        
        const exercise = await Exercises.create({
            name,
            type_id,
            default_sets,
            default_reps,
            default_weight,
            description,
            progression_from,
        });

        if (muscles && muscles.length > 0) {
            const muscleInstances = await Promise.all(
                muscles.map(async (muscleName) => {
                    const [muscle] = await Muscles.findOrCreate({
                        where: { name: muscleName },
                    });
                    return muscle;
                })
            );
            await exercise.addMuscles(muscleInstances);
        }

        const result = await Exercises.findByPk(exercise.id, {
            include: {
                model: Muscles,
                through: { attributes: [] },
            },
        });
    
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;