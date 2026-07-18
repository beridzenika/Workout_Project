module.exports = (sequelize, DataTypes) => {

    const Plans = sequelize.define(
        "Plans",
        {
            schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            plan_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "plans",
        }
    );

    Plans.associate = (models) => {
        
        Plans.belongsToMany(models.Exercises, {
            through: models.PlanExercises,
            foreignKey: "plan_id",
            otherKey: "exercise_id",
        });

        Plans.belongsToMany(models.Days, {
            through: "PlanDays",
        });

        Plans.belongsTo(models.Schedules, {
            foreignKey: "schedule_id",
        });
    }

    return Plans;
}