const {Plans, Schedules, User, Days } = require('../../models');
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
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json({schedules});
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



exports.create = async (req, res, next) => {
    try {
        const {name, description, is_public} = req.body;
        
        const created = await Schedules.create({
            //user_id
            name,
            description,
            is_public
        })

        res.status(201).json('schedule created');
    }
    catch(err) {
        next(err);
    }
}