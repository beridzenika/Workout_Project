const {Plans, Schedules, User, Days, Exercises, ExerciseTypes, PlanExercises, Muscles } = require('../../models');
const { Op, where } = require('sequelize');
const { addExercise } = require('./planController');

exports.getAll = async (req, res, next) => {
    try {
        const schedules = await Schedules.findAll({
            where: {
                [Op.or]: [
                    {is_public: true},
                    ...(req.user? [{user_id: req.user.id}] : []),
                ],
            },
            attributes: ['id', 'name', 'description', 'is_public', 'user_id', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'],
                },
                {
                    model: Plans,
                    include: [
                        {
                            model: Days,
                            through: {attributes:[]},
                            attributes:['id'],
                        },
                    ],
                    attributes:['id']
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        const data = schedules.map(schedule => {
            const json = schedule.toJSON();
            console.log(json.Plans);
            const total_days = new Set(
                (json.Plans ?? []).flatMap(plan => 
                    (plan.Days ?? []).map(day=>day.id))
            ).size;
            delete json.Plans;
            return {
                ...json, total_days,
            }
        })

        res.json({data});
    }
    catch(err) {
        next(err);
    }
}
exports.getById = async (req, res, next) => {
    try {
        
        const schedule = await Schedules.findByPk(req.params.id, {
            include: [
                {
                    model: Plans,

                    include: [
                        {
                            model: Days,
                            through: {attributes:[]},
                            attributes:['id', 'name'],
                        },
                    ],
                    attributes: ['id', 'name', 'plan_type'],
                },
            ],
        });

        if(!schedule) {
            return res.status(404).json({message: 'Schedule not found'});
        }
        if(!schedule.is_public && schedule.user !== req.user_id) {
            return res.status(404).json({message: 'Schedule not found'});
        }

        res.json({schedule});

    } catch (err) {
        next(err);
    }
}

exports.getByDay = async (req, res, next) => {
    try {
        const {id, day} = req.params;

        const schedule = await Schedules.findByPk(id);

        if(!schedule) {
            return res.status(404).json({message: 'Schedule not found'});
        }
        if(!schedule.is_public && schedule.user_id !== req.user.id) {
            return res.status(404).json({message: 'Schedule not found'});
        }

        const dayRow = await Days.findOne({
            where: {id: day},
            attributes: ['id', 'name'],
        });

        if (!dayRow) {
            return res.status(400).json({ message: 'day is not a valid' });
        }

        const plans = await Plans.findAll({
            where: {schedule_id: schedule.id},
            include: [
                {
                    model: Days,
                    through: {
                        attributes: [],
                        where: {DayId: dayRow.id},
                    },
                    attributes: [],
                    required: true,
                },
                {
                    model: Exercises,
                    through: {attributes: []},
                    attributes: [
                        'id', 
                        'name', 
                        'default_sets', 
                        'default_reps', 
                        'default_weight', 
                        'description',
                    ],
                    include: [
                        {
                            model: ExerciseTypes,
                            attributes: ['id', 'name'],
                        },
                        {
                            model: Muscles,
                            through: {attributes: []},
                            attributes: ['id', 'name'],
                        }
                    ],
                    order: [[{model: PlanExercises}, 'order_index', 'ASC']],
                }
            ]
        });

        const grouped = {
            warmup:   plans.find(p => p.plan_type === 'warmup')   ?? null,
            main:     plans.find(p => p.plan_type === 'main')     ?? null,
            cooldown: plans.find(p => p.plan_type === 'cooldown') ?? null,
        }

        res.status(200).json({
            schedule: {id: schedule.id, name: schedule.name},
            day: dayRow.name,
            plans: grouped,
        });
    }
    catch(err) {
        next(err);
    }
}

exports.create = async (req, res, next) => {
    try {
        const {name, description, is_public} = req.body;
        
        if(!name || !description) {
            return res.status(400).json({message: 'name and description required'});
        }

        const schedule = await Schedules.create({
            name,
            description,
            is_public: is_public ?? false,
            user_id: req.user.id,
        })

        res.status(201).json(schedule);
    }
    catch(err) {
        next(err);
    }
}