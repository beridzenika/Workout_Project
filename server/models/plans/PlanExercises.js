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
    
    
    return PlanExercises;
}