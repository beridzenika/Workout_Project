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

exports.delete = async (req, res, next) => {
    try {
        const {id} = req.body;

        const deleted = await ExerciseTypes.destroy({
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