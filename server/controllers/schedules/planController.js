const {Plans, Exercises, PlanExercises, Days} = require('../../models')

exports.getAll = async (req, res, next) => {
    try {
        const plans = await Plans.findAll({
            include: [
                //TODO: filter through schedules
                {
                    model: Days,
                    through: {attributes: [] },
                    attributes: ['id', 'name'],
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
            ],
        });
        
        if(!plan) {
            return res.status(404).json({message: 'Plan not found'});
        }
        //TODO: add schedule

        res.json({plan});
    }
    catch(err) {
        next(err);
    }
}

exports.create = async (req, res, next) => {
    try {
        const {schedule_id, name, plan_type, days} = req.body;
        
        if(!schedule_id || !name || !plan_type) {
            return res.status(400).json({message: 'schedule_id, name and plan_type are required.'});
        }

        const validTypes = ['main', 'warmup', 'cooldown', 'cardio'];
        if(!validTypes.includes(plan_type)) {
            return res.status(400).json({message: `plan_type must be one of: ${validTypes.join(', ')}`});
        }

        const plan = await Plans.create({schedule_id, name, plan_type});

        res.status(201).json({ plan: created });

    } 
    catch(err) {
        next(err);
    }
}