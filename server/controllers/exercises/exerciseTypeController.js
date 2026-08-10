const ExerciseTypes = require("../../models").ExerciseTypes;

exports.getAll = async (req, res, next) => {
    try {
        const types = await ExerciseTypes.findAll({
            attributes: ["id", "name"],
        });
        
        res.json(types);
    } 
    catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({message: "Name is required."});
        }

        const existing = await ExerciseTypes.findOne({
            where: { name },
        });

        if (existing) {
            return res.status(409).json({
                message: "Exercise type already exists.",
            });
        }

        const types = await ExerciseTypes.create({
            name,
        });
        
        res.status(201).json(types);
    } 
    catch (err) {
        next(err);
    }
};


exports.delete = async (req, res, next) => {
    try {
        const {id} = req.body;

        const deleted = await ExerciseTypes.destroy({
            where: {id},
        });

        if(!deleted) {
            res.status(404).json({message: "Exercise type not found."});
        }
        
        res.json({message: "Exercise type deleted successfully"});
    } 
    catch (err) {
        next(err);
    }
};