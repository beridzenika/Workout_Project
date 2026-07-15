const { DataTypes } = require("sequelize");
const { sequelize } = require("..");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3,50],
            },
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        display_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    User.associate = (models) => {
        User.hasMany(models.RefreshToken, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });

        User.hasMany(models.Schedules, {
            foreignKey: "user_id",
        });
    };

    return User;
}