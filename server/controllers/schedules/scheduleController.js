const {Plans, Schedules, Users } = require('../../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
    try {
        const schedules = await Schedules.findAll({
            where: {
                [Op.or]: [
                    {is_public: true},
                    {user_id: req.user.id},
                ],
            },
            attributes: ['id', 'name', 'description', 'is_public', 'user_id', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.json({schedules});
    }
    catch(err) {
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