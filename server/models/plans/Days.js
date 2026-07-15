module.exports = (sequelize, DataTypes) => {
    
    const Days = sequelize.define(
        "Days",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "days",
        }
    );

    Days.associate = (models) => {
        Days.belongsToMany(models.Plans, {
            through: "PlanDays",
        });
    };

    return Days;
}