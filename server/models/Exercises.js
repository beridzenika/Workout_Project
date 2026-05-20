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
                type: DataTypes.INTEGER,
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
            }
        },
        {
            tableName: "exercises",
        }
    );

    Exercises.associate = (models) => {
        Exercises.belongsToMany(models.Muscles, {
            through: "ExerciseMuscles",
        });
    };

    return Exercises;
}