const {Plans, Exercises, ExerciseTypes, Muscles, PlanExercises, Days} = require('../../models');
const Schedules = require('../../models').Schedules;

exports.getAll = async (req, res, next) => {
    try {
        const plans = await Plans.findAll({
            include: [
                {
                    model: Days,
                    through: {attributes: [] },
                    attributes: ['id', 'name'],
                }
            ],
            include: [
                {
                    model: Schedules,
                    where: {user_id: req.user.id},
                    attributes: [],
                }
            ]
        });
        
        res.json({plans});

    }catch(err) {
        next(err);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const plan = await Plans.findByPk(req.params.id, {
            include: [
                {
                    model: Days,
                    through: {attributes:[]},
                    attributes: ['id', 'name'],
                },
                {
                    model: Exercises,
                    through: {
                        attributes: ['order_index', 'rest']
                    },
                    attributes: ['id', 'name', 'default_sets', 'default_reps', 'default_weight'],
                    order: [[PlanExercises, 'order_index', 'ASC']],
                    
                    include: [
                        {
                            model: ExerciseTypes,
                            attributes: ['id', 'name'],
                        },
                        {
                            model: Muscles,
                            through:{attributes:[]},
                            attributes: ["id", "name"],
                        }
                    ]
                }
            ],
        });
        
        if(!plan) {
            return res.status(404).json({message: 'Plan not found'});
        }
        
        const schedule = await Schedules.findOne({
            where: { id: plan.schedule_id, user_id: req.user.id },
        });
        if (!schedule) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json({plan});
    }
    catch(err) {
        next(err);
    }
}

exports.createPlan = async (req, res, next) => {
    try {
        const {schedule_id, name, plan_type, day_ids} = req.body;
        
        if(!schedule_id || !name || !plan_type) {
            return res.status(400).json({message: 'schedule_id, name and plan_type are required.'});
        }
        if(!day_ids?.length) {
            return res.status(400).json({message: 'need to choose days.'});
        }
        
        const validTypes = ['main', 'warmup', 'cooldown', 'cardio'];
        if(!validTypes.includes(plan_type)) {
            return res.status(400).json({message: `plan_type must be one of: ${validTypes.join(', ')}`});
        }

        const plan = await Plans.create({
            schedule_id,
            name,
            plan_type,
        });
        
        const days = await Days.findAll({where: {id: day_ids}});
        await plan.setDays(days);
        
        const created = await Plans.findByPk( plan.id, {
            include: [
                {
                    model: Days,
                    through: {attributes:[]},
                    attributes: ['id', 'name'],
                }
            ]
        })
        console.log(created);
        res.status(201).json({ created });

    } 
    catch(err) {
        next(err);
    }
}

exports.addExercise = async (req, res, next) => {
    try {
        const {exercise_id, order_index, rest} = req.body;
        
        if(!exercise_id || order_index === undefined) {
            return res.status(400).json({message: 'exercise_id and order_id are required.'});
        }

        const plan = await Plans.findByPk(req.params.id);
        if(!plan) {
            return res.status(404).json({message: 'Plan not found.'});
        }

        const exercise = await Exercises.findByPk(exercise_id);
        if(!exercise) {
            return res.status(404).json({message: 'Exercise not found.'});
        }

        await PlanExercises.create({
            plan_id: plan.id,
            exercise_id,
            order_index,
            rest: rest ?? 30,
        });
        
        res.status(201).json({message: 'exercise added to plan'});
    }
    catch(err) {
        next(err);
    }
}
exports.addExercises = async (req, res, next) => {
    try {
        const exercises = req.body.exercises;
        
        if(!Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({message: 'exercises array required'});
        }

        const plan = await Plans.findByPk(req.params.id);
        if(!plan) {
            return res.status(404).json({message: 'Plan not found.'});
        }

        const invalid = exercises.some(e => !e.exercise_id);
        if(invalid) {
            return res.status(400).json({message: 'Every exerscise should have exercise_id and order_index'});
        }

        const exercise_ids = exercises.map(e => e.exercise_id);
        const existingExercises = await Exercises.findAll({where: {id: exercise_ids}});
        
        if(existingExercises.length !== exercise_ids.length) {
            return res.status(400).json({message: 'One or more exercises do not exist.'})
        }

        const rows = exercises.map( exercise => ({
            plan_id: plan.id,
            exercise_id: exercise.exercise_id,
            order_index: exercise.order_index,
            rest: exercise.rest ?? 30,
        }));
        await PlanExercises.bulkCreate(rows);
        
        res.status(201).json('Exercises added to the plan succesfully');

    } catch (err) {
        next(err);
    }
}