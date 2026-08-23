const Muscles = require("../../models").Muscles;

exports.getAll = async (req, res, next) => {
    try {
        const muscles = await Muscles.findAll({
            attributes: ["id", "name"],
        });

        res.json(muscles);
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

        const existing = await Muscles.findOne({
            where: { name },
        });

        if (existing) {
            return res.status(409).json({
                message: "Muscle already exists.",
            });
        }

        const types = await Muscles.create({
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

        const deleted = await Muscles.destroy({
            where: {id},
        });

        if(!deleted) {
            res.status(404).json({message: "Muscle not found."});
        }
        
        res.json({message: "Muscle deleted successfully"});
    } 
    catch (err) {
        next(err);
    }
};