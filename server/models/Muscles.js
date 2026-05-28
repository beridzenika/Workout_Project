module.exports = (sequelize, DataTypes) => {
    
    const Muscles = sequelize.define(
        "Muscles",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            tableName: "muscles",
        }
    );

    Muscles.associate = (models) => {
        Muscles.belongsToMany(models.Exercises, {
            through: "ExerciseMuscles",
        });
    };

    return Muscles;
}