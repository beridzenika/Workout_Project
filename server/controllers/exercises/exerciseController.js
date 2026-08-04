const { Exercises, Muscles, ExerciseTypes } = require("../../models");
const { Op, where } = require("sequelize");

exports.getAll = async (req, res, next) => {
    try {
        const {page, limit} = req.query;

        const where = {};
        if (req.query.search) {
            where.name = {[Op.like]: `%${req.query.search}%`};
        }
        if (req.query.type) {
            where.type_id = req.query.type;
        }
        if (req.query.progress_from) {
            where.progression_from = req.query.progress_from;
        }

        if (req.query.progression_to) {
            where.progression_to = req.query.progress_to;
        }

        const muscleInclude = {
            model: Muscles,
            through: { attributes: [] },
            attributes: ['id', 'name'],
        }
        if(req.query.muscle) {
            muscleInclude.where = {
                id: req.query.muscle,
            };
            muscleInclude.required = true;
        }

        const query = {
            where,
            distinct: true,
            attributes: [
                "id",
                "name",
                "default_sets",
                "default_reps",
                "default_weight",
                "description",
                "progression_from",
                "progression_to",
            ],
            include: [
                {
                    model: ExerciseTypes,
                    attributes: ["id", "name"],
                },
                muscleInclude,
            ],
        };
        
        if(page && limit) {
            query.limit = Number(limit);
            query.offset = (Number(page) - 1) * Number(limit);
        }

        const exercises = await Exercises.findAndCountAll(query);
        x
        res.status(200).json(exercises);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid exercise ID"
            });
        }
        
        const exercise = await Exercises.findByPk(id, {
            attributes: ['id', 
                    'name', 
                    'default_sets', 
                    'default_reps', 
                    'default_weight', 
                    'description', 
                    'progression_from', 
                    'progression_to'],
            include: [
                {
                    model: ExerciseTypes,
                    attributes: ['id', 'name'],
                },
                {
                    model: Muscles,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                },
            ],
        });

        if(!exercise) {
            return res.status(404).json({error: 'Exercise not found'});
        }
        res.status(200).json(exercise);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

exports.create = async (req, res, next) => {
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
};
