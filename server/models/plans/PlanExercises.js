const { DataTypes } = require("sequelize");
const { sequelize } = require("..");

module.exports = (sequelize, DataTypes) => {
    const PlanExercises = sequelize.define(
        "PlanExercises",
        {
            plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            exercise_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            order_index: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rest: {
                type: DataTypes.TINYINT,
                allowNull: true,
            }
        },
        {
            tableName: "plan_exercises",
        }
    );
    // PlanExercises.associate = (models) => {
    //     PlanExercises.belongsTo(models.Plans, {
    //         foreignKey: "plan_id",
    //     });
    //     PlanExercises.belongsTo(models.Exercises, {
    //         foreignKey: "exercise_id",
    //     });
    // }
    return PlanExercises;
}