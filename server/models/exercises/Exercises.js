module.exports = (sequelize, DataTypes) => {

    const Exercises = sequelize.define(
        "Exercises", 
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            default_sets: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            default_reps: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            default_weight: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            progression_from: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            progression_to: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
            // TODO: progression can be seperate as exercise can branch to
            //       multiple progressions
        },
        {
            tableName: "exercises",
        }
    );

    Exercises.associate = (models) => {
        Exercises.belongsToMany(models.Muscles, {
            through: "ExerciseMuscles",
        });
        Exercises.belongsTo(models.ExerciseTypes, {
            foreignKey: "type_id",
        });
        
        Exercises.belongsToMany(models.Plans, {
            through: models.PlanExercises,
            foreignKey: "exercise_id",
            otherKey: "plan_id",
        });
    };

    return Exercises;
}