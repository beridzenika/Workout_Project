module.exports = (sequelize, DataTypes) => {

    const Schedules = sequelize.define(
        "Schedules",
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_public: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            tableName: "schedules",
        },
    );

    Schedules.associate = (models) => {
        
        Schedules.hasMany(models.Plans, {
            foreignKey: "schedule_id",
        });
        Schedules.belongsTo(models.User, {
            foreignKey: "user_id",
        });
    }

    return Schedules;
}