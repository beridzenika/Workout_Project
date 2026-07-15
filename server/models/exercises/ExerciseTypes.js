module.exports = (sequelize, DataTypes) => {

    const ExerciseTypes = sequelize.define(
        "ExerciseTypes",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            tableName: "exercise_types",
        }
    );

    ExerciseTypes.associate = (models) => {
        ExerciseTypes.hasMany(models.Exercises, {
            foreignKey: "type_id",
        });
    }

    return ExerciseTypes;
}